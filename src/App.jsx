import { useState, useEffect, useRef } from 'react';
import QRForm from './components/QRForm.jsx';
import QRPreview from './components/QRPreview.jsx';
import CustomizationPanel from './components/CustomizationPanel.jsx';
import Presets from './components/Presets.jsx';
import RecentCodes from './components/RecentCodes.jsx';
import FlashScanIntro from './components/FlashScanIntro.jsx';
import { buildQrPayload, validateQrForm } from './utils/qrUtils.js';
import {
  getRecentCodes,
  saveRecentCode,
  deleteRecentCode,
  clearRecentCodes,
  getStoredTheme,
  setStoredTheme,
  hasSeenIntro,
  markIntroSeen,
  resetIntroState,
} from './utils/storage.js';
import './App.css';

const DEFAULT_SETTINGS = {
  size: 240,
  margin: 2,
  level: 'M',
  colorMode: 'solid',
  fgColor: '#0f172a',
  gradientColor1: '#4f46e5',
  gradientColor2: '#06b6d4',
  gradientDirection: 'diagonal-down',
  bgColor: '#ffffff',
  dotsType: 'square',
  cornersSquareType: 'square',
  cornersDotType: 'square',
  logo: null,
  logoSize: 0.15,
  logoMargin: 4,
};

const SAMPLE_VALUES = {
  url: { url: 'https://github.com/developer/portfolio' },
  text: { text: 'Hello from FlashScan! Create beautiful, customizable QR codes in seconds.' },
  email: {
    email: 'contact@acme-design.studio',
    subject: 'FlashScan QR Collaboration',
    body: 'Hi, I created this branded QR code with FlashScan and would like to connect.',
  },
  phone: { phone: '+1 (555) 382-9012' },
  wifi: {
    ssid: 'Studio_Guest_5G',
    password: 'superSecretPassword2026',
    encryption: 'WPA',
    hidden: false,
  },
};

export default function App() {
  const [theme, setTheme] = useState(getStoredTheme);
  const [showIntro, setShowIntro] = useState(!hasSeenIntro());
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const [selectedType, setSelectedType] = useState('url');
  const [formStore, setFormStore] = useState({
    url: { url: 'https://github.com' },
    text: { text: '' },
    email: { email: '', subject: '', body: '' },
    phone: { phone: '' },
    wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false },
  });

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [recentItems, setRecentItems] = useState([]);

  // Toast Notification state
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Auto-save debounce ref
  const saveTimeoutRef = useRef(null);

  // Sync theme with DOM and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setStoredTheme(theme);
  }, [theme]);

  // Load saved recent codes from localStorage on initial mount
  useEffect(() => {
    const loaded = getRecentCodes();
    setRecentItems(loaded);
  }, []);

  const showNotification = (message, type = 'info') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ id: Date.now(), message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showNotification(`Switched to ${nextTheme} theme.`, 'info');
  };

  const handleDismissIntro = () => {
    markIntroSeen();
    setShowIntro(false);
    // Smooth scroll and focus to the generator section
    setTimeout(() => {
      const generatorElem = document.getElementById('generator-workspace');
      if (generatorElem) {
        generatorElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleReplayIntro = () => {
    resetIntroState();
    setShowIntro(true);
  };

  const currentValues = formStore[selectedType] || {};
  const validation = validateQrForm(selectedType, currentValues);
  const payload = validation.isValid ? buildQrPayload(selectedType, currentValues) : '';

  // Auto-save to localStorage after user settles on a valid configuration
  useEffect(() => {
    if (!validation.isValid || !payload) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const updated = saveRecentCode({
        type: selectedType,
        values: currentValues,
        settings,
        payload,
      });
      setRecentItems(updated);
    }, 1200);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [payload, validation.isValid, selectedType, settings]);

  const handleTypeChange = (newType) => {
    setSelectedType(newType);
  };

  const handleValueChange = (field, val) => {
    setFormStore((prev) => ({
      ...prev,
      [selectedType]: {
        ...prev[selectedType],
        [field]: val,
      },
    }));
  };

  const handleSettingChange = (field, val) => {
    setSettings((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handlePresetSelect = (presetSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...presetSettings,
    }));
    showNotification('Applied branded preset.', 'info');
  };

  const handleResetStyle = () => {
    setSettings(DEFAULT_SETTINGS);
    showNotification('Style options reset to safe defaults.', 'info');
  };

  const handleLoadSample = () => {
    const sample = SAMPLE_VALUES[selectedType];
    if (sample) {
      setFormStore((prev) => ({
        ...prev,
        [selectedType]: { ...sample },
      }));
      showNotification(`Sample ${selectedType.toUpperCase()} data loaded.`, 'info');
    }
  };

  const handleRestoreRecent = (item) => {
    if (!item) return;
    setSelectedType(item.type);
    setFormStore((prev) => ({
      ...prev,
      [item.type]: { ...item.values },
    }));
    if (item.settings) {
      setSettings(item.settings);
    }
    showNotification(`Restored: ${item.title}`, 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRecent = (id) => {
    const updated = deleteRecentCode(id);
    setRecentItems(updated);
    showNotification('Removed item from recent history.', 'info');
  };

  const handleClearAllRecent = () => {
    const empty = clearRecentCodes();
    setRecentItems(empty);
    showNotification('All recent QR codes cleared.', 'info');
  };

  return (
    <div className="app-shell">
      {/* Welcome Intro Screen Overlay */}
      {showIntro && (
        <FlashScanIntro
          onStartCreating={handleDismissIntro}
          onSkipIntro={handleDismissIntro}
        />
      )}

      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`toast-notification toast-${toast.type}`}
          role="status"
          aria-live="polite"
        >
          <span className="toast-icon" aria-hidden="true">
            {toast.type === 'success' && '✓'}
            {toast.type === 'error' && '✕'}
            {toast.type === 'info' && 'ℹ'}
          </span>
          <span className="toast-text">{toast.message}</span>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setToast(null)}
            aria-label="Dismiss message"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="brand-group">
            <div className="brand-logo" aria-hidden="true">
              {/* Lightning Bolt + QR Glyph */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2.2" />
                <rect x="13" y="2" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2.2" />
                <rect x="2" y="13" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2.2" />
                <polygon points="16 11 12 17 15 17 13 23 20 15 16 15" fill="#38bdf8" />
              </svg>
            </div>
            <div>
              <span className="brand-title">FlashScan</span>
              <span className="brand-tagline">Create. Customize. Scan.</span>
            </div>
          </div>

          <div className="header-actions">
            {/* Replay Intro Button */}
            <button
              type="button"
              className="btn-replay-intro"
              onClick={handleReplayIntro}
              title="Show welcome introduction"
              aria-label="Replay introduction"
            >
              <span>⚡</span>
              <span className="btn-replay-text">Intro</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <>
                  <svg className="theme-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                  <span className="theme-label">Light Mode</span>
                </>
              ) : (
                <>
                  <svg className="theme-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  <span className="theme-label">Dark Mode</span>
                </>
              )}
            </button>

            <div className="header-badge">
              <span className="badge-bullet" aria-hidden="true" />
              <span>Fast & Private</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="main-content" id="generator-workspace" tabIndex={-1}>
        {/* Compact Welcome Banner for returning users */}
        {!showIntro && !bannerDismissed && (
          <div className="welcome-banner" role="status">
            <div className="welcome-banner-content">
              <span className="welcome-banner-bolt" aria-hidden="true">⚡</span>
              <div>
                <strong>FlashScan</strong> — Create beautiful, customizable QR codes in seconds. All processing is 100% private in your browser.
              </div>
            </div>
            <button
              type="button"
              className="welcome-banner-dismiss"
              onClick={() => setBannerDismissed(true)}
              aria-label="Dismiss banner"
              title="Dismiss banner"
            >
              ✕
            </button>
          </div>
        )}

        <div className="workspace-container">
          {/* Left Column: Form & Design Controls */}
          <div className="controls-column">
            <section aria-label="QR Code Information">
              <QRForm
                selectedType={selectedType}
                onTypeChange={handleTypeChange}
                values={currentValues}
                onChangeValue={handleValueChange}
                errors={validation.errors}
                onLoadSample={handleLoadSample}
              />
            </section>

            <section aria-label="Branded Presets">
              <Presets
                currentSettings={settings}
                onSelectPreset={handlePresetSelect}
              />
            </section>

            <section aria-label="Design Settings">
              <CustomizationPanel
                settings={settings}
                onChange={handleSettingChange}
                onResetStyle={handleResetStyle}
                onNotify={showNotification}
              />
            </section>
          </div>

          {/* Right Column: Sticky Live Preview & Scan Quality */}
          <div className="preview-column">
            <aside className="sticky-preview-wrapper" aria-label="Live QR Code Preview">
              <QRPreview
                payload={payload}
                isValid={validation.isValid}
                settings={settings}
                selectedType={selectedType}
                validationErrors={validation.errors}
                onNotify={showNotification}
              />
            </aside>
          </div>
        </div>

        {/* Bottom Section: Recent Codes */}
        <div className="workspace-container full-span">
          <RecentCodes
            items={recentItems}
            onRestore={handleRestoreRecent}
            onDelete={handleDeleteRecent}
            onClearAll={handleClearAllRecent}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <p>© FlashScan. Create beautiful, customizable QR codes in seconds.</p>
          <div className="footer-links">
            <span>Fast Client-Side</span>
            <span>·</span>
            <span>Gradients & Custom Eyes</span>
            <span>·</span>
            <span>Centre Logo Overlay</span>
            <span>·</span>
            <span>PNG & SVG Vector Export</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
