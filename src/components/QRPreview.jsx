import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { evaluateScanQuality } from '../utils/qrUtils.js';

/**
 * QRPreview Component
 * High-performance branded QR rendering using `qr-code-styling`:
 * - Supports solid colors, linear gradients, and radial gradients
 * - Custom dot shapes (square, rounded, dots, classy, extra-rounded)
 * - Custom corner squares and corner dots
 * - Safe centre logo overlay with padding
 * - Lossless PNG and SVG downloads
 * - Live Scan Quality assessment
 */
export default function QRPreview({
  payload,
  isValid,
  settings,
  selectedType,
  validationErrors,
  onNotify,
}) {
  const containerRef = useRef(null);
  const qrCodeRef = useRef(null);

  const quality = isValid && payload ? evaluateScanQuality(settings) : null;

  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Convert settings to qr-code-styling options
  const buildStylingOptions = () => {
    let rotation = 0;
    if (settings.gradientDirection === 'top-to-bottom') {
      rotation = Math.PI / 2;
    } else if (settings.gradientDirection === 'diagonal-down') {
      rotation = Math.PI / 4;
    } else if (settings.gradientDirection === 'diagonal-up') {
      rotation = -Math.PI / 4;
    }

    const isGradient = settings.colorMode !== 'solid';
    const gradientConfig = isGradient
      ? {
          type: settings.colorMode, // 'linear' or 'radial'
          rotation,
          colorStops: [
            { offset: 0, color: settings.gradientColor1 || '#4f46e5' },
            { offset: 1, color: settings.gradientColor2 || '#06b6d4' },
          ],
        }
      : undefined;

    return {
      width: Number(settings.size) || 240,
      height: Number(settings.size) || 240,
      type: 'canvas',
      data: payload || ' ',
      image: settings.logo || undefined,
      margin: Number(settings.margin) || 0,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: settings.logo ? 'H' : settings.level || 'M',
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: Number(settings.logoSize) || 0.15,
        margin: Number(settings.logoMargin) || 4,
        crossOrigin: 'anonymous',
      },
      dotsOptions: {
        type: settings.dotsType || 'square',
        color: !isGradient ? settings.fgColor : undefined,
        gradient: gradientConfig,
      },
      backgroundOptions: {
        color: settings.bgColor || '#ffffff',
      },
      cornersSquareOptions: {
        type: settings.cornersSquareType || 'square',
        color: !isGradient ? settings.fgColor : undefined,
        gradient: gradientConfig,
      },
      cornersDotOptions: {
        type: settings.cornersDotType || 'square',
        color: !isGradient ? settings.fgColor : undefined,
        gradient: gradientConfig,
      },
    };
  };

  // Render and update QR code on changes without memory leaks or duplicate elements
  useEffect(() => {
    if (!isValid || !payload) {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      return;
    }

    const options = buildStylingOptions();

    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling(options);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        qrCodeRef.current.append(containerRef.current);
      }
    } else {
      qrCodeRef.current.update(options);
      // Ensure canvas element is attached to DOM container
      if (containerRef.current && containerRef.current.children.length === 0) {
        qrCodeRef.current.append(containerRef.current);
      }
    }
  }, [payload, isValid, settings]);

  // Download PNG using qr-code-styling built-in export
  const handleDownloadPng = async () => {
    if (!isValid || !payload || !qrCodeRef.current) return;
    try {
      const fileName = `flashscan-${selectedType}-${getTodayDateString()}`;
      await qrCodeRef.current.download({
        name: fileName,
        extension: 'png',
      });
      onNotify?.('High-resolution PNG downloaded successfully.', 'success');
    } catch (err) {
      console.error('PNG download error:', err);
      onNotify?.('Failed to download PNG. Please retry.', 'error');
    }
  };

  // Download SVG using qr-code-styling built-in vector export
  const handleDownloadSvg = async () => {
    if (!isValid || !payload || !qrCodeRef.current) return;
    try {
      const fileName = `flashscan-${selectedType}-${getTodayDateString()}`;
      await qrCodeRef.current.download({
        name: fileName,
        extension: 'svg',
      });
      onNotify?.('Scalable vector SVG downloaded successfully.', 'success');
    } catch (err) {
      console.error('SVG download error:', err);
      onNotify?.('Failed to download SVG. Please retry.', 'error');
    }
  };

  // Copy QR Raw Content to Clipboard
  const handleCopyContent = async () => {
    if (!isValid || !payload) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(payload);
        onNotify?.('QR code content copied to clipboard!', 'success');
      } else {
        const temp = document.createElement('textarea');
        temp.value = payload;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        onNotify?.('QR code content copied to clipboard!', 'success');
      }
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      onNotify?.('Unable to access clipboard automatically.', 'error');
    }
  };

  // Web Share API with fallback
  const handleShare = async () => {
    if (!isValid || !payload) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code: ${selectedType.toUpperCase()}`,
          text: payload,
          url: payload.startsWith('http') ? payload : undefined,
        });
        onNotify?.('Shared successfully!', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyContent();
        }
      }
    } else {
      handleCopyContent();
      onNotify?.('Sharing not supported on this browser; copied to clipboard instead.', 'info');
    }
  };

  return (
    <div className="preview-card">
      <div className="preview-card-header">
        <div className="preview-title-group">
          <span className="live-status-dot" aria-hidden="true" />
          <h3 className="card-title">Live Preview</h3>
        </div>
        <div className="meta-tag font-mono">
          {settings.size}×{settings.size}px · {settings.logo ? 'ECC H (Logo)' : `ECC ${settings.level}`}
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="preview-canvas-viewport">
        {isValid && payload ? (
          <div
            className="qr-canvas-shadow-wrapper"
            style={{ backgroundColor: settings.bgColor }}
          >
            {/* qr-code-styling mounts canvas here */}
            <div ref={containerRef} className="styling-qr-container" />
          </div>
        ) : (
          <div className="empty-preview-state">
            <div className="empty-grid-graphic" aria-hidden="true">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <path d="M14 14h3v3h-3z" />
                <path d="M19 14v6" />
                <path d="M14 19h6" />
              </svg>
            </div>
            <h4 className="empty-title">Ready to Generate</h4>
            <p className="empty-subtitle">
              {Object.keys(validationErrors).length > 0
                ? 'Resolve the form errors on the left to preview your QR code.'
                : 'Enter your content to immediately generate your branded QR code.'}
            </p>
          </div>
        )}
      </div>

      {/* Primary Export Actions */}
      <div className="preview-actions-area">
        <div className="download-buttons-grid">
          <button
            type="button"
            className="btn-download-primary"
            onClick={handleDownloadPng}
            disabled={!isValid || !payload}
            aria-label="Download QR code as PNG image"
          >
            <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PNG
          </button>

          <button
            type="button"
            className="btn-download-secondary"
            onClick={handleDownloadSvg}
            disabled={!isValid || !payload}
            aria-label="Download QR code as scalable vector SVG"
          >
            <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            Download SVG
          </button>
        </div>

        {/* Secondary Action Row: Copy & Share */}
        <div className="secondary-actions-row">
          <button
            type="button"
            className="btn-action-ghost"
            onClick={handleCopyContent}
            disabled={!isValid || !payload}
            aria-label="Copy encoded QR string to clipboard"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy Content
          </button>

          <button
            type="button"
            className="btn-action-ghost"
            onClick={handleShare}
            disabled={!isValid || !payload}
            aria-label="Share QR code content"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share
          </button>
        </div>

        {(!isValid || !payload) && (
          <p className="download-disabled-hint">
            Actions are disabled until valid data is entered.
          </p>
        )}
      </div>

      {/* Enhanced Scan Quality Card */}
      {quality && (
        <div className={`scan-quality-card ${quality.badgeClass}`} role="region" aria-label="Scan Quality Analysis">
          <div className="quality-header-row">
            <div className="quality-title-wrap">
              <span className="quality-label">Scan Quality</span>
              <span className="quality-score-metric font-mono">{quality.score}/100</span>
            </div>
            <span className={`quality-badge ${quality.badgeClass}`}>
              {quality.status}
            </span>
          </div>

          <div className="quality-meter-track" aria-hidden="true">
            <div
              className={`quality-meter-fill ${quality.badgeClass}`}
              style={{ width: `${quality.score}%` }}
            />
          </div>

          <ul className="quality-suggestions-list">
            {quality.suggestions.map((suggestion, idx) => (
              <li key={idx}>{suggestion}</li>
            ))}
          </ul>

          <p className="quality-disclaimer">
            * This is a visual guideline, not a guarantee. Always test-scan your final QR code on a phone.
          </p>
        </div>
      )}

      {/* Payload Inspector */}
      {isValid && payload && (
        <div className="payload-inspector">
          <div className="payload-inspector-header">
            <span className="payload-title">Encoded String Payload</span>
          </div>
          <div className="payload-raw-box font-mono" title={payload}>
            {payload}
          </div>
        </div>
      )}
    </div>
  );
}
