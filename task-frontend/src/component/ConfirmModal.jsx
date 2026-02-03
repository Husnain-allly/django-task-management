export default function ConfirmModal({
  open,
  message,
  confirmText,
  loading,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirm</h2>

        <p>{message}</p>

        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
            type="button"
          >
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={loading}
            type="button"
          >
            {loading ? "..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
