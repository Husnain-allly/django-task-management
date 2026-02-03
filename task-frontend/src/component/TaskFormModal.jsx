import { useEffect, useMemo, useState } from "react";

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export default function TaskFormModal({
  open,
  mode, // "create" | "edit"
  initialTask, // task object when editing, null when creating
  loading,
  onClose,
  onSubmit, // (payload) => Promise<void>
}) {
  const isEdit = mode === "edit";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState(""); // YYYY-MM-DD
  const [archived, setArchived] = useState(false);
  const [localError, setLocalError] = useState("");

  // Prefill when opening
  useEffect(() => {
    if (!open) return;

    setLocalError("");

    if (isEdit && initialTask) {
      setTitle(initialTask.title ?? "");
      setDescription(initialTask.description ?? "");
      setStatus(initialTask.status ?? "todo");
      setDueDate(initialTask.due_date ?? ""); // should already be YYYY-MM-DD
      setArchived(Boolean(initialTask.is_archived));
    } else {
      // create defaults
      setTitle("");
      setDescription("");
      setStatus("todo");
      setDueDate("");
      setArchived(false);
    }
  }, [open, isEdit, initialTask]);

  const titleText = useMemo(() => (isEdit ? "Edit Task" : "Create Task"), [isEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");

    const trimmed = title.trim();
    if (!trimmed) {
      setLocalError("Title is required");
      return;
    }

    const payload = {
      title: trimmed,
      description: description || "",
      status,
      due_date: dueDate || null, // ✅ DRF accepts null
      is_archived: archived,
    };

    await onSubmit(payload);
  }

  function handleClose() {
    if (loading) return;
    onClose();
  }

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{titleText}</h2>
          <button className="icon-btn" type="button" onClick={handleClose} disabled={loading}>
            ✕
          </button>
        </div>

        {localError ? <div className="form-error">{localError}</div> : null}

        <form onSubmit={handleSubmit}>
          <label className="label">Title *</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            autoFocus
          />

          <label className="label">Description</label>
          <textarea
            className="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description..."
            rows={4}
          />

          <div className="grid-2">
            <div>
              <label className="label">Status</label>
              <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Due date</label>
              <input
                type="date"
                className="input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={archived}
              onChange={(e) => setArchived(e.target.checked)}
            />
            Archived
          </label>

          <div className="modal-actions">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button className="btn btn-primary" disabled={loading} type="submit">
              {loading ? "Saving..." : isEdit ? "Save changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
