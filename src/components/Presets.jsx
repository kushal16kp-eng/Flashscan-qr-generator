/**
 * Presets Component
 * Quick visual presets with gradient styles, dot shapes, and branded themes.
 */

const PRESET_LIST = [
  {
    id: 'classic-black',
    name: 'Classic Black',
    description: 'Black square modules on pure white',
    settings: {
      colorMode: 'solid',
      fgColor: '#000000',
      bgColor: '#ffffff',
      dotsType: 'square',
      cornersSquareType: 'square',
      cornersDotType: 'square',
      logo: null,
    },
    swatchBg: '#ffffff',
    swatchFg: '#000000',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'White rounded modules on dark slate',
    settings: {
      colorMode: 'solid',
      fgColor: '#ffffff',
      bgColor: '#0f172a',
      dotsType: 'rounded',
      cornersSquareType: 'extra-rounded',
      cornersDotType: 'dot',
      logo: null,
    },
    swatchBg: '#0f172a',
    swatchFg: '#ffffff',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep blue gradient with rounded dots',
    settings: {
      colorMode: 'linear',
      gradientColor1: '#0284c7',
      gradientColor2: '#1e3a8a',
      gradientDirection: 'diagonal-down',
      bgColor: '#f0f9ff',
      dotsType: 'rounded',
      cornersSquareType: 'extra-rounded',
      cornersDotType: 'dot',
      logo: null,
    },
    swatchBg: '#f0f9ff',
    swatchFg: 'linear-gradient(135deg, #0284c7 0%, #1e3a8a 100%)',
  },
  {
    id: 'purple-glow',
    name: 'Purple Glow',
    description: 'Violet-to-indigo gradient with dots',
    settings: {
      colorMode: 'linear',
      gradientColor1: '#a855f7',
      gradientColor2: '#4f46e5',
      gradientDirection: 'diagonal-down',
      bgColor: '#0f172a',
      dotsType: 'dots',
      cornersSquareType: 'extra-rounded',
      cornersDotType: 'dot',
      logo: null,
    },
    swatchBg: '#0f172a',
    swatchFg: 'linear-gradient(135deg, #a855f7 0%, #4f46e5 100%)',
  },
  {
    id: 'green-pay',
    name: 'Green Pay',
    description: 'Emerald/teal payment-inspired style',
    settings: {
      colorMode: 'linear',
      gradientColor1: '#059669',
      gradientColor2: '#0f766e',
      gradientDirection: 'top-to-bottom',
      bgColor: '#ffffff',
      dotsType: 'classy',
      cornersSquareType: 'extra-rounded',
      cornersDotType: 'dot',
      logo: null,
    },
    swatchBg: '#ffffff',
    swatchFg: 'linear-gradient(180deg, #059669 0%, #0f766e 100%)',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Black dots on pure white, no logo',
    settings: {
      colorMode: 'solid',
      fgColor: '#18181b',
      bgColor: '#ffffff',
      dotsType: 'dots',
      cornersSquareType: 'square',
      cornersDotType: 'square',
      logo: null,
    },
    swatchBg: '#ffffff',
    swatchFg: '#18181b',
  },
];

export default function Presets({ currentSettings, onSelectPreset }) {
  return (
    <div className="presets-container">
      <div className="section-header-row">
        <label className="section-subheading">Branded Presets & Themes</label>
        <span className="section-hint">Select a preset, then customize freely</span>
      </div>

      <div className="presets-grid" role="group" aria-label="Visual branded presets">
        {PRESET_LIST.map((preset) => {
          const isMatch =
            currentSettings.colorMode === preset.settings.colorMode &&
            currentSettings.bgColor?.toLowerCase() === preset.settings.bgColor?.toLowerCase() &&
            currentSettings.dotsType === preset.settings.dotsType;

          return (
            <button
              key={preset.id}
              type="button"
              className={`preset-card ${isMatch ? 'preset-card-active' : ''}`}
              onClick={() => onSelectPreset(preset.settings)}
              aria-pressed={isMatch}
            >
              <div
                className="preset-swatch-box"
                style={{ backgroundColor: preset.swatchBg }}
                aria-hidden="true"
              >
                <div
                  className="preset-swatch-core"
                  style={{ background: preset.swatchFg }}
                />
              </div>
              <div className="preset-info">
                <span className="preset-name">{preset.name}</span>
                <span className="preset-desc">{preset.description}</span>
              </div>
              {isMatch && (
                <span className="preset-active-indicator" title="Currently selected preset">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
