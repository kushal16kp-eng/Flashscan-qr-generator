import { useRef } from 'react';

/**
 * CustomizationPanel Component
 * Comprehensive styling controls:
 * - Color modes (Solid, Linear Gradient, Radial Gradient)
 * - Custom QR shapes (Dots, Corner Squares, Corner Dots)
 * - Safe Centre Logo Upload & Sizing
 * - Dimensions, Margin, and Error Correction Levels
 */

const DOT_STYLES = [
  { id: 'square', label: 'Square', recommended: true },
  { id: 'rounded', label: 'Rounded', recommended: true },
  { id: 'dots', label: 'Dots', recommended: false },
  { id: 'classy', label: 'Classy', recommended: false },
  { id: 'extra-rounded', label: 'Extra Rounded', recommended: false },
];

const CORNER_SQUARE_STYLES = [
  { id: 'square', label: 'Square', recommended: true },
  { id: 'extra-rounded', label: 'Rounded', recommended: false },
  { id: 'dot', label: 'Circle Dot', recommended: false },
];

const CORNER_DOT_STYLES = [
  { id: 'square', label: 'Square', recommended: true },
  { id: 'dot', label: 'Circle Dot', recommended: false },
];

const ERROR_LEVELS = [
  { level: 'L', name: 'Low', desc: '7% recovery' },
  { level: 'M', name: 'Medium', desc: '15% recovery' },
  { level: 'Q', name: 'Quartile', desc: '25% recovery' },
  { level: 'H', name: 'High', desc: '30% recovery' },
];

export default function CustomizationPanel({
  settings,
  onChange,
  onResetStyle,
  onNotify,
}) {
  const fileInputRef = useRef(null);

  const handleColorChange = (key, value) => {
    let formatted = value;
    if (!formatted.startsWith('#')) {
      formatted = '#' + formatted;
    }
    onChange(key, formatted);
  };

  // Logo file upload handler using FileReader
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      onNotify?.('Please select a valid image file (PNG, JPG, or WebP).', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      onNotify?.('Logo file size exceeds 2MB limit. Please choose a smaller image.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      onChange('logo', dataUrl);
      // Logo requires High Error Correction (H)
      onChange('level', 'H');
      onNotify?.('Logo attached! Error correction set to High (H) for scanning safety.', 'success');
    };
    reader.onerror = () => {
      onNotify?.('Failed to read logo image.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onChange('logo', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onNotify?.('Centre logo removed.', 'info');
  };

  return (
    <div className="customization-card">
      <div className="customization-header">
        <div>
          <h3 className="card-title">QR Style & Branded Design</h3>
          <p className="card-subtitle">Fine-tune patterns, gradients, and logo overlays</p>
        </div>
        <button
          type="button"
          onClick={onResetStyle}
          className="btn-text-ghost"
          title="Reset all styling back to safe defaults without clearing your form data"
        >
          Reset Style
        </button>
      </div>

      <div className="customization-sections">
        {/* ================================================================
            1. Color Modes (Solid, Linear Gradient, Radial Gradient)
            ================================================================ */}
        <div className="custom-sub-section">
          <label className="section-subheading">Color Mode</label>
          <div className="color-mode-tabs" role="tablist" aria-label="Color mode selector">
            <button
              type="button"
              role="tab"
              aria-selected={settings.colorMode === 'solid'}
              className={`color-mode-btn ${settings.colorMode === 'solid' ? 'color-mode-btn-active' : ''}`}
              onClick={() => onChange('colorMode', 'solid')}
            >
              Solid Color
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={settings.colorMode === 'linear'}
              className={`color-mode-btn ${settings.colorMode === 'linear' ? 'color-mode-btn-active' : ''}`}
              onClick={() => onChange('colorMode', 'linear')}
            >
              Linear Gradient
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={settings.colorMode === 'radial'}
              className={`color-mode-btn ${settings.colorMode === 'radial' ? 'color-mode-btn-active' : ''}`}
              onClick={() => onChange('colorMode', 'radial')}
            >
              Radial Gradient
            </button>
          </div>

          <div className="control-groups-grid" style={{ marginTop: '1rem' }}>
            {/* Solid Mode Controls */}
            {settings.colorMode === 'solid' && (
              <>
                <div className="control-group">
                  <label className="control-label" htmlFor="fgColorInput">
                    Foreground Color
                  </label>
                  <div className="color-input-wrapper">
                    <input
                      id="fgColorInput"
                      type="color"
                      className="color-picker-input"
                      value={settings.fgColor}
                      onChange={(e) => onChange('fgColor', e.target.value)}
                      aria-label="Foreground color picker"
                    />
                    <input
                      type="text"
                      className="color-hex-input font-mono"
                      value={settings.fgColor}
                      onChange={(e) => handleColorChange('fgColor', e.target.value)}
                      placeholder="#000000"
                      maxLength={7}
                      aria-label="Foreground hex code"
                    />
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label" htmlFor="bgColorInput">
                    Background Color
                  </label>
                  <div className="color-input-wrapper">
                    <input
                      id="bgColorInput"
                      type="color"
                      className="color-picker-input"
                      value={settings.bgColor}
                      onChange={(e) => onChange('bgColor', e.target.value)}
                      aria-label="Background color picker"
                    />
                    <input
                      type="text"
                      className="color-hex-input font-mono"
                      value={settings.bgColor}
                      onChange={(e) => handleColorChange('bgColor', e.target.value)}
                      placeholder="#ffffff"
                      maxLength={7}
                      aria-label="Background hex code"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Linear Gradient Mode Controls */}
            {settings.colorMode === 'linear' && (
              <>
                <div className="control-group">
                  <label className="control-label" htmlFor="gradStartColor">
                    Gradient Start Color
                  </label>
                  <div className="color-input-wrapper">
                    <input
                      id="gradStartColor"
                      type="color"
                      className="color-picker-input"
                      value={settings.gradientColor1}
                      onChange={(e) => onChange('gradientColor1', e.target.value)}
                      aria-label="Gradient start color picker"
                    />
                    <input
                      type="text"
                      className="color-hex-input font-mono"
                      value={settings.gradientColor1}
                      onChange={(e) => handleColorChange('gradientColor1', e.target.value)}
                      placeholder="#4f46e5"
                      maxLength={7}
                      aria-label="Gradient start hex code"
                    />
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label" htmlFor="gradEndColor">
                    Gradient End Color
                  </label>
                  <div className="color-input-wrapper">
                    <input
                      id="gradEndColor"
                      type="color"
                      className="color-picker-input"
                      value={settings.gradientColor2}
                      onChange={(e) => onChange('gradientColor2', e.target.value)}
                      aria-label="Gradient end color picker"
                    />
                    <input
                      type="text"
                      className="color-hex-input font-mono"
                      value={settings.gradientColor2}
                      onChange={(e) => handleColorChange('gradientColor2', e.target.value)}
                      placeholder="#06b6d4"
                      maxLength={7}
                      aria-label="Gradient end hex code"
                    />
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label" htmlFor="gradDirection">
                    Gradient Direction
                  </label>
                  <select
                    id="gradDirection"
                    className="select-input"
                    value={settings.gradientDirection}
                    onChange={(e) => onChange('gradientDirection', e.target.value)}
                  >
                    <option value="left-to-right">Left to right (Horizontal)</option>
                    <option value="top-to-bottom">Top to bottom (Vertical)</option>
                    <option value="diagonal-down">Diagonal down (↘)</option>
                    <option value="diagonal-up">Diagonal up (↗)</option>
                  </select>
                </div>

                <div className="control-group">
                  <label className="control-label" htmlFor="bgLinearColor">
                    Background Color
                  </label>
                  <div className="color-input-wrapper">
                    <input
                      id="bgLinearColor"
                      type="color"
                      className="color-picker-input"
                      value={settings.bgColor}
                      onChange={(e) => onChange('bgColor', e.target.value)}
                      aria-label="Background color picker"
                    />
                    <input
                      type="text"
                      className="color-hex-input font-mono"
                      value={settings.bgColor}
                      onChange={(e) => handleColorChange('bgColor', e.target.value)}
                      placeholder="#ffffff"
                      maxLength={7}
                      aria-label="Background hex code"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Radial Gradient Mode Controls */}
            {settings.colorMode === 'radial' && (
              <>
                <div className="control-group">
                  <label className="control-label" htmlFor="radInnerColor">
                    Inner Center Color
                  </label>
                  <div className="color-input-wrapper">
                    <input
                      id="radInnerColor"
                      type="color"
                      className="color-picker-input"
                      value={settings.gradientColor1}
                      onChange={(e) => onChange('gradientColor1', e.target.value)}
                      aria-label="Inner center color picker"
                    />
                    <input
                      type="text"
                      className="color-hex-input font-mono"
                      value={settings.gradientColor1}
                      onChange={(e) => handleColorChange('gradientColor1', e.target.value)}
                      placeholder="#3b82f6"
                      maxLength={7}
                      aria-label="Inner center hex code"
                    />
                  </div>
                </div>

                <div className="control-group">
                  <label className="control-label" htmlFor="radOuterColor">
                    Outer Edge Color
                  </label>
                  <div className="color-input-wrapper">
                    <input
                      id="radOuterColor"
                      type="color"
                      className="color-picker-input"
                      value={settings.gradientColor2}
                      onChange={(e) => onChange('gradientColor2', e.target.value)}
                      aria-label="Outer edge color picker"
                    />
                    <input
                      type="text"
                      className="color-hex-input font-mono"
                      value={settings.gradientColor2}
                      onChange={(e) => handleColorChange('gradientColor2', e.target.value)}
                      placeholder="#1e3a8a"
                      maxLength={7}
                      aria-label="Outer edge hex code"
                    />
                  </div>
                </div>

                <div className="control-group full-width">
                  <label className="control-label" htmlFor="bgRadialColor">
                    Background Color
                  </label>
                  <div className="color-input-wrapper">
                    <input
                      id="bgRadialColor"
                      type="color"
                      className="color-picker-input"
                      value={settings.bgColor}
                      onChange={(e) => onChange('bgColor', e.target.value)}
                      aria-label="Background color picker"
                    />
                    <input
                      type="text"
                      className="color-hex-input font-mono"
                      value={settings.bgColor}
                      onChange={(e) => handleColorChange('bgColor', e.target.value)}
                      placeholder="#ffffff"
                      maxLength={7}
                      aria-label="Background hex code"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ================================================================
            2. Custom QR Shapes (Dots, Corner Squares, Corner Dots)
            ================================================================ */}
        <div className="custom-sub-section">
          <label className="section-subheading">QR Shapes & Pattern Styles</label>

          <div className="shapes-grid">
            {/* Dot Pattern Style */}
            <div className="control-group">
              <label className="control-label" htmlFor="dotsTypeSelect">
                Body Module Style
              </label>
              <select
                id="dotsTypeSelect"
                className="select-input"
                value={settings.dotsType}
                onChange={(e) => onChange('dotsType', e.target.value)}
              >
                {DOT_STYLES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label} {d.recommended ? '★ (Recommended)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Corner Square Style */}
            <div className="control-group">
              <label className="control-label" htmlFor="cornersSquareSelect">
                Corner Outer Eyes
              </label>
              <select
                id="cornersSquareSelect"
                className="select-input"
                value={settings.cornersSquareType}
                onChange={(e) => onChange('cornersSquareType', e.target.value)}
              >
                {CORNER_SQUARE_STYLES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} {c.recommended ? '★ (Recommended)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Corner Dot Style */}
            <div className="control-group full-width">
              <label className="control-label" htmlFor="cornersDotSelect">
                Corner Inner Eye Dots
              </label>
              <select
                id="cornersDotSelect"
                className="select-input"
                value={settings.cornersDotType}
                onChange={(e) => onChange('cornersDotType', e.target.value)}
              >
                {CORNER_DOT_STYLES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} {c.recommended ? '★ (Recommended)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ================================================================
            3. Safe Centre Logo Overlay
            ================================================================ */}
        <div className="custom-sub-section logo-sub-section">
          <div className="section-header-row">
            <label className="section-subheading">Centre Logo Overlay (Optional)</label>
            <span className="section-hint">Safe limit: max 20% width</span>
          </div>

          <div className="logo-upload-box">
            {settings.logo ? (
              <div className="logo-preview-active-wrap">
                <div className="logo-thumbnail-preview" aria-label="Logo preview">
                  <img src={settings.logo} alt="Uploaded centre logo" />
                </div>
                <div className="logo-details">
                  <span className="logo-status-tag">Logo Active</span>
                  <span className="logo-desc-text">
                    High error correction (H) automatically activated.
                  </span>
                  <button
                    type="button"
                    className="btn-danger-ghost text-xs"
                    onClick={handleRemoveLogo}
                  >
                    Remove Logo
                  </button>
                </div>
              </div>
            ) : (
              <div className="logo-empty-upload">
                <input
                  type="file"
                  id="logoFileInput"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn-upload-logo"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload logo image from your device"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Upload Logo (PNG, JPG, WebP)
                </button>
                <span className="logo-upload-hint">
                  Processed entirely in your browser; never sent to any server.
                </span>
              </div>
            )}
          </div>

          {settings.logo && (
            <div className="logo-controls-grid" style={{ marginTop: '0.875rem' }}>
              <div className="control-group">
                <div className="slider-label-row">
                  <label className="control-label" htmlFor="logoSizeSlider">
                    Logo Scale (% of QR)
                  </label>
                  <span className="slider-value-pill font-mono">
                    {Math.round(settings.logoSize * 100)}%
                  </span>
                </div>
                <input
                  id="logoSizeSlider"
                  type="range"
                  min="0.08"
                  max="0.20"
                  step="0.01"
                  value={settings.logoSize}
                  onChange={(e) => onChange('logoSize', Number(e.target.value))}
                  className="custom-range-slider"
                />
                <div className="slider-ticks-row">
                  <span>8% (minimal)</span>
                  <span>15% (default)</span>
                  <span>20% (safe max)</span>
                </div>
              </div>

              <div className="control-group">
                <div className="slider-label-row">
                  <label className="control-label" htmlFor="logoMarginSlider">
                    Logo Safe Padding
                  </label>
                  <span className="slider-value-pill font-mono">
                    {settings.logoMargin}px
                  </span>
                </div>
                <input
                  id="logoMarginSlider"
                  type="range"
                  min="0"
                  max="8"
                  step="1"
                  value={settings.logoMargin}
                  onChange={(e) => onChange('logoMargin', Number(e.target.value))}
                  className="custom-range-slider"
                />
                <div className="slider-ticks-row">
                  <span>0px (tight)</span>
                  <span>4px (standard)</span>
                  <span>8px (spacious)</span>
                </div>
              </div>

              <div className="logo-notice-banner full-width">
                <span className="logo-notice-icon">⚠️</span>
                <span>
                  High error correction helps QR codes remain readable with a centre logo. Always test-scan before sharing.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ================================================================
            4. Dimensions, Margins, and Error Correction
            ================================================================ */}
        <div className="custom-sub-section">
          <label className="section-subheading">Dimensions & Recovery</label>

          <div className="control-groups-grid" style={{ marginTop: '0.875rem' }}>
            {/* QR Size Slider */}
            <div className="control-group full-width">
              <div className="slider-label-row">
                <label className="control-label" htmlFor="qrSizeSlider">
                  Canvas Dimensions
                </label>
                <span className="slider-value-pill font-mono">
                  {settings.size} × {settings.size} px
                </span>
              </div>
              <input
                id="qrSizeSlider"
                type="range"
                min="128"
                max="400"
                step="8"
                value={settings.size}
                onChange={(e) => onChange('size', Number(e.target.value))}
                className="custom-range-slider"
              />
              <div className="slider-ticks-row">
                <span>128px (compact)</span>
                <span>240px (standard)</span>
                <span>400px (print-ready)</span>
              </div>
            </div>

            {/* Quiet Zone / Margin Slider */}
            <div className="control-group full-width">
              <div className="slider-label-row">
                <label className="control-label" htmlFor="marginSlider">
                  Quiet Zone Margin (Padding)
                </label>
                <span className="slider-value-pill font-mono">
                  {settings.margin} {settings.margin === 1 ? 'block' : 'blocks'}
                </span>
              </div>
              <input
                id="marginSlider"
                type="range"
                min="0"
                max="6"
                step="1"
                value={settings.margin}
                onChange={(e) => onChange('margin', Number(e.target.value))}
                className="custom-range-slider"
              />
              <div className="slider-ticks-row">
                <span>0 (edge-to-edge)</span>
                <span>2 (recommended)</span>
                <span>6 (wide border)</span>
              </div>
            </div>

            {/* Error Correction Level */}
            <div className="control-group full-width">
              <div className="slider-label-row">
                <label className="control-label" id="errorCorrectionLabel">
                  Error Correction Level
                </label>
                {settings.logo && (
                  <span className="slider-value-pill font-mono">
                    Locked to H (Logo Active)
                  </span>
                )}
              </div>
              <div
                className="segmented-button-group"
                role="radiogroup"
                aria-labelledby="errorCorrectionLabel"
              >
                {ERROR_LEVELS.map((item) => {
                  const isSelected = settings.level === item.level;
                  const isLocked = Boolean(settings.logo) && item.level !== 'H';
                  return (
                    <button
                      key={item.level}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={isLocked}
                      className={`segmented-button ${isSelected ? 'segmented-button-active' : ''}`}
                      onClick={() => onChange('level', item.level)}
                    >
                      <span className="segmented-code font-mono">{item.level}</span>
                      <span className="segmented-title">{item.name}</span>
                      <span className="segmented-subtitle">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
