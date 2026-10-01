/**
 * QRForm Component
 * Renders type selector and appropriate dynamic input fields with inline validation.
 */

const QR_TYPES = [
  { id: 'url', label: 'URL / Website', icon: '🔗' },
  { id: 'text', label: 'Plain Text', icon: '📝' },
  { id: 'email', label: 'Email', icon: '✉️' },
  { id: 'phone', label: 'Phone', icon: '📞' },
  { id: 'wifi', label: 'Wi-Fi', icon: '📶' },
];

export default function QRForm({
  selectedType,
  onTypeChange,
  values,
  onChangeValue,
  errors,
  onLoadSample,
}) {
  return (
    <div className="form-card">
      {/* Type Selector Navigation */}
      <div className="type-selector-header">
        <label className="section-subheading" id="typeSelectorLabel">
          Select QR Code Type
        </label>
        <button
          type="button"
          onClick={onLoadSample}
          className="btn-text-ghost text-xs"
          title="Populate fields with sample data"
        >
          Load Example Data
        </button>
      </div>

      <div
        className="type-tabs-grid"
        role="tablist"
        aria-labelledby="typeSelectorLabel"
      >
        {QR_TYPES.map((t) => {
          const isSelected = selectedType === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`type-tab-btn ${isSelected ? 'type-tab-btn-active' : ''}`}
              onClick={() => onTypeChange(t.id)}
            >
              <span className="type-tab-icon" aria-hidden="true">
                {t.icon}
              </span>
              <span className="type-tab-label">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Content Inputs */}
      <div className="form-fields-container">
        {/* --- URL Type --- */}
        {selectedType === 'url' && (
          <div className="input-group">
            <label htmlFor="urlInput" className="input-label">
              Website URL <span className="required-star">*</span>
            </label>
            <div className="input-with-prefix">
              <span className="input-prefix" aria-hidden="true">
                https://
              </span>
              <input
                id="urlInput"
                type="text"
                className={`text-input ${errors.url ? 'input-error' : ''}`}
                placeholder="example.com/portfolio"
                value={values.url || ''}
                onChange={(e) => onChangeValue('url', e.target.value)}
                autoComplete="url"
                aria-describedby={errors.url ? 'urlError' : 'urlHint'}
              />
            </div>
            {errors.url ? (
              <p id="urlError" className="error-message" role="alert">
                {errors.url}
              </p>
            ) : (
              <p id="urlHint" className="helper-hint">
                Links without <code>https://</code> will be automatically normalized.
              </p>
            )}
          </div>
        )}

        {/* --- Plain Text Type --- */}
        {selectedType === 'text' && (
          <div className="input-group">
            <label htmlFor="textInput" className="input-label">
              Plain Text Content <span className="required-star">*</span>
            </label>
            <textarea
              id="textInput"
              rows={4}
              className={`text-area ${errors.text ? 'input-error' : ''}`}
              placeholder="Enter notes, raw messages, quotes, or codes..."
              value={values.text || ''}
              onChange={(e) => onChangeValue('text', e.target.value)}
              aria-describedby={errors.text ? 'textError' : 'textCharCount'}
            />
            <div className="input-bottom-row">
              {errors.text ? (
                <p id="textError" className="error-message" role="alert">
                  {errors.text}
                </p>
              ) : (
                <span className="helper-hint">Supports alphanumeric characters and multiline text.</span>
              )}
              <span id="textCharCount" className="char-count font-mono">
                {(values.text || '').length} chars
              </span>
            </div>
          </div>
        )}

        {/* --- Email Type --- */}
        {selectedType === 'email' && (
          <div className="stacked-fields">
            <div className="input-group">
              <label htmlFor="emailRecipient" className="input-label">
                Recipient Email <span className="required-star">*</span>
              </label>
              <input
                id="emailRecipient"
                type="email"
                className={`text-input ${errors.email ? 'input-error' : ''}`}
                placeholder="hello@company.com"
                value={values.email || ''}
                onChange={(e) => onChangeValue('email', e.target.value)}
                autoComplete="email"
                aria-describedby={errors.email ? 'emailError' : undefined}
              />
              {errors.email && (
                <p id="emailError" className="error-message" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="emailSubject" className="input-label">
                Subject <span className="optional-tag">(Optional)</span>
              </label>
              <input
                id="emailSubject"
                type="text"
                className="text-input"
                placeholder="Meeting Inquiry / Consultation"
                value={values.subject || ''}
                onChange={(e) => onChangeValue('subject', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="emailBody" className="input-label">
                Message Body <span className="optional-tag">(Optional)</span>
              </label>
              <textarea
                id="emailBody"
                rows={3}
                className="text-area"
                placeholder="Hi there, I would like to learn more about..."
                value={values.body || ''}
                onChange={(e) => onChangeValue('body', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* --- Phone Number Type --- */}
        {selectedType === 'phone' && (
          <div className="input-group">
            <label htmlFor="phoneInput" className="input-label">
              Phone Number <span className="required-star">*</span>
            </label>
            <input
              id="phoneInput"
              type="tel"
              className={`text-input ${errors.phone ? 'input-error' : ''}`}
              placeholder="+1 (555) 234-5678"
              value={values.phone || ''}
              onChange={(e) => onChangeValue('phone', e.target.value)}
              autoComplete="tel"
              aria-describedby={errors.phone ? 'phoneError' : 'phoneHint'}
            />
            {errors.phone ? (
              <p id="phoneError" className="error-message" role="alert">
                {errors.phone}
              </p>
            ) : (
              <p id="phoneHint" className="helper-hint">
                Supports international format with +, hyphens, brackets, and spaces.
              </p>
            )}
          </div>
        )}

        {/* --- Wi-Fi Type --- */}
        {selectedType === 'wifi' && (
          <div className="stacked-fields">
            <div className="input-group">
              <label htmlFor="wifiSsid" className="input-label">
                Network Name (SSID) <span className="required-star">*</span>
              </label>
              <input
                id="wifiSsid"
                type="text"
                className={`text-input ${errors.ssid ? 'input-error' : ''}`}
                placeholder="Studio_Guest_5G"
                value={values.ssid || ''}
                onChange={(e) => onChangeValue('ssid', e.target.value)}
                aria-describedby={errors.ssid ? 'ssidError' : undefined}
              />
              {errors.ssid && (
                <p id="ssidError" className="error-message" role="alert">
                  {errors.ssid}
                </p>
              )}
            </div>

            <div className="fields-split-row">
              <div className="input-group flex-1">
                <label htmlFor="wifiEncryption" className="input-label">
                  Security Encryption
                </label>
                <select
                  id="wifiEncryption"
                  className="select-input"
                  value={values.encryption || 'WPA'}
                  onChange={(e) => onChangeValue('encryption', e.target.value)}
                >
                  <option value="WPA">WPA / WPA2 / WPA3 (Default)</option>
                  <option value="WEP">WEP (Legacy)</option>
                  <option value="None">None (Open Network)</option>
                </select>
              </div>

              {(values.encryption || 'WPA') !== 'None' && (
                <div className="input-group flex-1">
                  <label htmlFor="wifiPassword" className="input-label">
                    Password <span className="required-star">*</span>
                  </label>
                  <input
                    id="wifiPassword"
                    type="text"
                    className={`text-input ${errors.password ? 'input-error' : ''}`}
                    placeholder="Enter network password"
                    value={values.password || ''}
                    onChange={(e) => onChangeValue('password', e.target.value)}
                    aria-describedby={errors.password ? 'passError' : undefined}
                  />
                  {errors.password && (
                    <p id="passError" className="error-message" role="alert">
                      {errors.password}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="checkbox-row">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  id="wifiHidden"
                  checked={Boolean(values.hidden)}
                  onChange={(e) => onChangeValue('hidden', e.target.checked)}
                />
                <span className="checkbox-custom" />
                <span className="checkbox-label">Hidden network (SSID is not broadcasted)</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
