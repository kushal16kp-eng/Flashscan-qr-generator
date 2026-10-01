/**
 * QR Code Generator Utilities
 * Pure helper functions for payload generation, validation, contrast analysis,
 * and comprehensive Scan Quality scoring.
 */

/**
 * Escapes special characters for Wi-Fi QR strings (WIFI:...)
 * Special characters \ , ; : " must be escaped with a backslash.
 */
function escapeWifiString(str) {
  if (!str) return '';
  return str.replace(/([\\;,:"'])/g, '\\$1');
}

/**
 * Builds the standard payload string for each QR code type.
 * @param {string} type - 'url' | 'text' | 'email' | 'phone' | 'wifi'
 * @param {Object} values - form values corresponding to the type
 * @returns {string} The formatted QR payload
 */
export function buildQrPayload(type, values = {}) {
  switch (type) {
    case 'url': {
      const raw = (values.url || '').trim();
      if (!raw) return '';
      if (!/^https?:\/\//i.test(raw)) {
        return `https://${raw}`;
      }
      return raw;
    }

    case 'text': {
      return (values.text || '').trim();
    }

    case 'email': {
      const email = (values.email || '').trim();
      if (!email) return '';
      const params = [];
      if (values.subject && values.subject.trim()) {
        params.push(`subject=${encodeURIComponent(values.subject.trim())}`);
      }
      if (values.body && values.body.trim()) {
        params.push(`body=${encodeURIComponent(values.body.trim())}`);
      }
      const queryString = params.length > 0 ? `?${params.join('&')}` : '';
      return `mailto:${email}${queryString}`;
    }

    case 'phone': {
      const phone = (values.phone || '').trim();
      if (!phone) return '';
      return `tel:${phone}`;
    }

    case 'wifi': {
      const ssid = (values.ssid || '').trim();
      if (!ssid) return '';
      const auth = values.encryption || 'WPA';
      const password = values.password || '';
      const hidden = Boolean(values.hidden);

      const encType = auth === 'None' || auth === 'nopass' ? 'nopass' : auth;
      const passParam = encType === 'nopass' ? '' : `P:${escapeWifiString(password)};`;

      return `WIFI:T:${encType};S:${escapeWifiString(ssid)};${passParam}H:${hidden ? 'true' : 'false'};;`;
    }

    default:
      return '';
  }
}

/**
 * Validates inputs for the selected QR code type.
 * @param {string} type - 'url' | 'text' | 'email' | 'phone' | 'wifi'
 * @param {Object} values - input values
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateQrForm(type, values = {}) {
  const errors = {};

  switch (type) {
    case 'url': {
      const url = (values.url || '').trim();
      if (!url) {
        errors.url = 'Website URL is required.';
      } else {
        const testUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
        try {
          const parsed = new URL(testUrl);
          if (!parsed.hostname || !parsed.hostname.includes('.')) {
            errors.url = 'Enter a valid domain name (e.g. domain.com).';
          }
        } catch {
          errors.url = 'Please enter a valid URL structure.';
        }
      }
      break;
    }

    case 'text': {
      const text = (values.text || '').trim();
      if (!text) {
        errors.text = 'Plain text content cannot be empty.';
      }
      break;
    }

    case 'email': {
      const email = (values.email || '').trim();
      if (!email) {
        errors.email = 'Recipient email address is required.';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.email = 'Please enter a valid email address (e.g. name@domain.com).';
        }
      }
      break;
    }

    case 'phone': {
      const phone = (values.phone || '').trim();
      if (!phone) {
        errors.phone = 'Phone number is required.';
      } else {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{3,20}$/;
        if (!phoneRegex.test(phone)) {
          errors.phone = 'Enter a valid phone number (+, digits, spaces, and hyphens allowed).';
        }
      }
      break;
    }

    case 'wifi': {
      const ssid = (values.ssid || '').trim();
      if (!ssid) {
        errors.ssid = 'Network name (SSID) cannot be empty.';
      }
      const encryption = values.encryption || 'WPA';
      if (encryption === 'WPA' || encryption === 'WEP') {
        const password = values.password || '';
        if (!password || password.trim().length === 0) {
          errors.password = `A password is required for ${encryption} protected networks.`;
        }
      }
      break;
    }

    default:
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Converts standard 3 or 6-digit hex (#rrggbb) to RGB object
 */
export function hexToRgb(hex) {
  if (!hex) return { r: 0, g: 0, b: 0 };
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Calculates Euclidean distance between two colors in RGB space (0 to ~441.67).
 */
export function getColorDistance(hex1, hex2) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Evaluates comprehensive Scan Quality based on:
 * - Color mode (solid, linear, radial) & contrast distance
 * - Canvas size
 * - Quiet zone margin
 * - Error correction level
 * - Logo overlay presence & relative size
 *
 * Returns one of: 'Excellent' | 'Good' | 'Needs Attention' | 'Risky'
 */
export function evaluateScanQuality(settings) {
  const {
    colorMode = 'solid',
    fgColor = '#000000',
    gradientColor1 = '#4f46e5',
    gradientColor2 = '#06b6d4',
    bgColor = '#ffffff',
    size = 240,
    margin = 2,
    level = 'M',
    logo = null,
    logoSize = 0.15,
  } = settings;

  const suggestions = [];
  const numSize = Number(size) || 240;
  const numMargin = Number(margin) ?? 2;
  const numLogoSize = Number(logoSize) || 0.15;

  let points = 100;

  // 1. Contrast Evaluation
  let minDistance = 442;
  if (colorMode === 'solid') {
    minDistance = getColorDistance(fgColor, bgColor);
  } else {
    const dist1 = getColorDistance(gradientColor1, bgColor);
    const dist2 = getColorDistance(gradientColor2, bgColor);
    minDistance = Math.min(dist1, dist2);

    // Also check if gradient colors are too close to each other or too washed out
    const interGradientDist = getColorDistance(gradientColor1, gradientColor2);
    if (interGradientDist < 30) {
      suggestions.push('Gradient start and end colors are almost identical; consider a higher contrast pair.');
    }
  }

  if (minDistance < 90) {
    points -= 55;
    suggestions.push('Contrast between QR modules and background is critically low. Optical scanners will likely fail to register the code.');
  } else if (minDistance < 135) {
    points -= 25;
    suggestions.push('Improve contrast between the QR colors and background for fast camera acquisition.');
  } else if (minDistance < 175) {
    points -= 10;
  }

  // 2. Size Evaluation
  if (numSize < 180) {
    points -= 25;
    suggestions.push(`Current QR size (${numSize}px) is below the recommended 180px minimum. Small codes may blur when printed.`);
  } else if (numSize < 220) {
    points -= 10;
    suggestions.push('Increasing canvas dimensions above 220px improves readability from greater scanning distances.');
  }

  // 3. Margin / Quiet Zone Evaluation
  if (numMargin < 1) {
    points -= 25;
    suggestions.push('Quiet zone is set to 0. Add at least 2 margin blocks to prevent surrounding elements from interfering with camera framing.');
  } else if (numMargin < 2) {
    points -= 10;
    suggestions.push('A quiet zone margin of 2 or more blocks is recommended for standard camera edge-detection.');
  }

  // 4. Logo Overlay & Error Correction Safety
  if (logo) {
    if (level !== 'H') {
      points -= 35;
      suggestions.push('A centre logo is enabled with error correction below High (H). Switch to High (H) to safeguard damaged or obscured modules.');
    }
    if (numLogoSize > 0.20) {
      points -= 25;
      suggestions.push('Logo size exceeds 20% of QR width. Larger logos obstruct too many internal modules.');
    } else {
      suggestions.push('High error correction is active to preserve scan integrity around the centre logo. Always test-scan before sharing.');
    }
  } else {
    if (level === 'L') {
      points -= 10;
      suggestions.push('Low error correction (7%) leaves little room for dirt or physical damage if printed.');
    }
  }

  // Determine Overall Rating
  let status = 'Excellent';
  let badgeClass = 'quality-excellent';

  if (minDistance < 90 || points < 50 || (logo && level !== 'H')) {
    status = 'Risky';
    badgeClass = 'quality-risky';
  } else if (points < 72) {
    status = 'Needs Attention';
    badgeClass = 'quality-attention';
  } else if (points < 88) {
    status = 'Good';
    badgeClass = 'quality-good';
  } else {
    status = 'Excellent';
    badgeClass = 'quality-excellent';
  }

  if (suggestions.length === 0) {
    suggestions.push('Optimal configuration! High contrast, sufficient quiet zone, and reliable error correction.');
  }

  return {
    score: Math.max(0, Math.min(100, points)),
    status,
    badgeClass,
    suggestions,
    contrastDistance: Math.round(minDistance),
  };
}
