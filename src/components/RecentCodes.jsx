/**
 * RecentCodes Component
 * Displays up to 6 recently generated QR configurations persisted in localStorage.
 * Allows restoring, deleting single items, and clearing all history.
 */

function formatTimestamp(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
      ' · ' +
      date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

const TYPE_ICONS = {
  url: '🔗',
  text: '📝',
  email: '✉️',
  phone: '📞',
  wifi: '📶',
};

export default function RecentCodes({ items, onRestore, onDelete, onClearAll }) {
  const handleClearWithConfirm = () => {
    if (window.confirm('Are you sure you want to clear all saved recent QR codes?')) {
      onClearAll();
    }
  };

  return (
    <section className="recent-codes-section" aria-labelledby="recentCodesHeading">
      <div className="recent-header-row">
        <div>
          <h2 id="recentCodesHeading" className="section-title">
            Recent QR Codes
          </h2>
          <p className="section-subtitle">
            Saved locally in your browser. Click any item to reload its contents and styling.
          </p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            className="btn-danger-ghost"
            onClick={handleClearWithConfirm}
            aria-label="Clear all recent QR codes"
          >
            Clear All History
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="recent-empty-state">
          <div className="empty-clock-icon" aria-hidden="true">⏱️</div>
          <p className="recent-empty-text">
            No recent codes yet. As you enter valid information and create QR codes, your latest 6 configurations will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="recent-grid">
          {items.map((item) => (
            <div
              key={item.id}
              className="recent-card"
              role="article"
              aria-label={`Recent QR code: ${item.title}`}
            >
              <div
                className="recent-card-body"
                onClick={() => onRestore(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onRestore(item);
                  }
                }}
                title="Click to restore this QR code"
              >
                <div className="recent-card-top">
                  <span className="recent-type-badge">
                    <span aria-hidden="true">{TYPE_ICONS[item.type] || '⚡'}</span>
                    <span className="recent-type-text">{item.type.toUpperCase()}</span>
                  </span>
                  <span className="recent-time font-mono">
                    {formatTimestamp(item.createdAt)}
                  </span>
                </div>

                <h4 className="recent-card-title">{item.title}</h4>

                <div className="recent-card-footer">
                  <div className="recent-color-pills" aria-label="Color configuration">
                    <span
                      className="recent-dot"
                      style={{ backgroundColor: item.settings?.fgColor || '#000' }}
                      title={`Foreground: ${item.settings?.fgColor}`}
                    />
                    <span
                      className="recent-dot"
                      style={{
                        backgroundColor: item.settings?.bgColor || '#fff',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                      title={`Background: ${item.settings?.bgColor}`}
                    />
                  </div>
                  <span className="recent-restore-hint">
                    Restore ↗
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="recent-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                aria-label={`Delete ${item.title} from recent codes`}
                title="Delete this QR"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
