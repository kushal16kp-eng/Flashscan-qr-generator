/**
 * LocalStorage management for FlashScan
 * Handles persistent recent QR history, light/dark theme preference,
 * and intro welcome screen state.
 */

const STORAGE_KEY = 'flashscan_recent_codes_v1';
const THEME_KEY = 'flashscan_theme_v1';
const INTRO_SEEN_KEY = 'flashscanIntroSeen';
const MAX_RECENT_ITEMS = 6;

/**
 * Checks if the user has already seen or skipped the intro screen.
 * @returns {boolean}
 */
export function hasSeenIntro() {
  try {
    return localStorage.getItem(INTRO_SEEN_KEY) === 'true';
  } catch (err) {
    console.warn('LocalStorage intro check failed:', err);
    return false;
  }
}

/**
 * Marks the intro screen as completed/seen.
 */
export function markIntroSeen() {
  try {
    localStorage.setItem(INTRO_SEEN_KEY, 'true');
  } catch (err) {
    console.warn('Failed to save intro state:', err);
  }
}

/**
 * Clears the intro-seen state so the user can replay the introduction.
 */
export function resetIntroState() {
  try {
    localStorage.removeItem(INTRO_SEEN_KEY);
  } catch (err) {
    console.warn('Failed to clear intro state:', err);
  }
}

/**
 * Returns the stored theme preference or falls back to system preference.
 * @returns {'dark' | 'light'}
 */
export function getStoredTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch (err) {
    console.warn('LocalStorage theme access unavailable:', err);
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  }

  return 'dark';
}

/**
 * Persists the user's theme preference.
 * @param {'dark' | 'light'} theme
 */
export function setStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.warn('Failed to persist theme:', err);
  }
}

/**
 * Generates a human-friendly title/summary for a given QR configuration.
 */
export function generateQrTitle(type, values) {
  if (!values) return 'Untitled QR';
  switch (type) {
    case 'url':
      return values.url || 'Web Link';
    case 'text':
      return values.text ? values.text.slice(0, 36) + (values.text.length > 36 ? '…' : '') : 'Plain Text';
    case 'email':
      return values.email ? `Email: ${values.email}` : 'Email Message';
    case 'phone':
      return values.phone ? `Tel: ${values.phone}` : 'Phone Contact';
    case 'wifi':
      return values.ssid ? `Wi-Fi: ${values.ssid}` : 'Wi-Fi Network';
    default:
      return 'FlashScan QR';
  }
}

/**
 * Retrieves the stored list of recent QR codes.
 * Ensures the app never crashes if localStorage is corrupted or unavailable.
 * @returns {Array} Array of saved QR configuration objects
 */
export function getRecentCodes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to parse recent codes from localStorage:', err);
    return [];
  }
}

/**
 * Saves a new QR configuration into recent history.
 * Deduplicates exact payload + colors + type matches and caps at 6 items.
 * @param {Object} item - { type, values, settings, title, payload }
 * @returns {Array} Updated list of recent QR configurations
 */
export function saveRecentCode(item) {
  try {
    const current = getRecentCodes();
    const title = item.title || generateQrTitle(item.type, item.values);

    const signature = `${item.type}:${item.payload}:${item.settings?.colorMode}:${item.settings?.fgColor}:${item.settings?.bgColor}`;

    const newItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: item.type,
      values: item.values,
      settings: item.settings,
      title,
      payload: item.payload,
      signature,
      createdAt: new Date().toISOString(),
    };

    const filtered = current.filter((entry) => entry.signature !== signature && entry.payload !== item.payload);

    const updated = [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save recent code to localStorage:', err);
    return getRecentCodes();
  }
}

/**
 * Deletes a single saved QR configuration by ID.
 * @param {string} id
 * @returns {Array} Updated list of recent QR configurations
 */
export function deleteRecentCode(id) {
  try {
    const current = getRecentCodes();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to delete recent code from localStorage:', err);
    return getRecentCodes();
  }
}

/**
 * Clears all recent codes from localStorage.
 * @returns {Array} Empty array
 */
export function clearRecentCodes() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear recent codes from localStorage:', err);
  }
  return [];
}
