/**
 * FlashScanIntro Component
 * Premium, accessible welcome screen with subtle entrance animations,
 * technology-focused styling, and fast transition into the generator.
 */

export default function FlashScanIntro({ onStartCreating, onSkipIntro }) {
  return (
    <div
      className="intro-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to FlashScan"
    >
      {/* Background Decorative Glowing Shapes & Grid */}
      <div className="intro-bg-glow glow-top-left" aria-hidden="true" />
      <div className="intro-bg-glow glow-bottom-right" aria-hidden="true" />
      <div className="intro-bg-grid" aria-hidden="true" />

      <div className="intro-card">
        {/* Brand Icon & Logo */}
        <div className="intro-logo-wrap animate-pop-in">
          <div className="intro-logo-icon" aria-hidden="true">
            {/* Lightning bolt combined with QR square glyph */}
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2.2" />
              <rect x="13" y="2" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2.2" />
              <rect x="2" y="13" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2.2" />
              {/* Lightning Bolt accent in the center-right */}
              <polygon points="17 11 13 17 16 17 14 23 21 15 17 15" fill="#38bdf8" />
            </svg>
          </div>
          <span className="intro-brand-name">FlashScan</span>
          <span className="intro-brand-tagline">Create. Customize. Scan.</span>
        </div>

        {/* Hero Headings */}
        <h1 className="intro-heading animate-fade-slide-up">
          Create QR codes that stand out.
        </h1>

        <p className="intro-subtext animate-fade-slide-up delay-1">
          Generate, customize, and download professional QR codes — all in your browser.
        </p>

        {/* Feature Highlights Pills */}
        <div className="intro-features-row animate-fade-slide-up delay-1" aria-hidden="true">
          <span className="intro-feature-chip">⚡ Fast Client-Side</span>
          <span className="intro-feature-chip">🎨 Gradients & Logos</span>
          <span className="intro-feature-chip">📐 Vector SVG & PNG</span>
        </div>

        {/* Interactive Action Buttons */}
        <div className="intro-actions-row animate-fade-slide-up delay-2">
          <button
            type="button"
            className="btn-intro-primary"
            onClick={onStartCreating}
            autoFocus
            aria-label="Start creating your QR code now"
          >
            Start Creating
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>

          <button
            type="button"
            className="btn-intro-secondary"
            onClick={onSkipIntro}
            aria-label="Skip introduction and proceed directly to generator"
          >
            Skip intro
          </button>
        </div>
      </div>
    </div>
  );
}
