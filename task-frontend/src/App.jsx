import { useEffect, useMemo, useState } from "react";
import {
  fetchTasks,
  deleteTask,
  archiveTask,
  markTaskDone,
  createTask,
  updateTask,
   unarchiveTask,  
} from "./api/tasks";
import ConfirmModal from "./component/ConfirmModal";
import TaskFormModal from "./component/TaskFormModal";
import "./App.css";

const STATUS_LABELS = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showArchived, setShowArchived] = useState(false);


  // confirm modal (delete / archive / done)
  const [confirmState, setConfirmState] = useState({
    open: false,
    action: null, // "delete" | "archive" | "done"
    taskId: null,
    message: "",
    confirmText: "Confirm",
  });
  const [confirmLoading, setConfirmLoading] = useState(false);

  // create/edit modal
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // "create" | "edit"
  const [activeTask, setActiveTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  async function loadTasks() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchTasks();
      setTasks(Array.isArray(data) ? data : (data?.results ?? []));
    } catch (e) {
      setError(e.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // --- Create/Edit modal helpers ---
  function openCreate() {
    setError("");
    setFormMode("create");
    setActiveTask(null);
    setFormOpen(true);
  }

  function openEdit(task) {
    setError("");
    setFormMode("edit");
    setActiveTask(task);
    setFormOpen(true);
  }

  function closeForm() {
    if (formLoading) return;
    setFormOpen(false);
  }

  async function handleSubmitForm(payload) {
    setFormLoading(true);
    setError("");
    try {
      if (formMode === "create") {
        const created = await createTask(payload);
        setTasks((prev) => [created, ...prev]);
      } else {
        const updated = await updateTask(activeTask.id, payload);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      }
      setFormOpen(false);
    } catch (e) {
      setError(e.message || "Failed to save task");
      // keep modal open so user can fix
    } finally {
      setFormLoading(false);
    }
  }

  // --- Confirm modal helpers ---
  function openConfirm(action, task) {
    if (action === "delete") {
      setConfirmState({
        open: true,
        action,
        taskId: task.id,
        message: `Delete: ${task.title}?`,
        confirmText: "Yes, delete",
      });
    }

    if (action === "done") {
      setConfirmState({
        open: true,
        action,
        taskId: task.id,
        message: `Mark this task as Done: ${task.title}?`,
        confirmText: "Yes, mark done",
      });
    }

    if (action === "archive") {
      setConfirmState({
        open: true,
        action,
        taskId: task.id,
        message: `Archive this task: ${task.title}?`,
        confirmText: "Yes, archive",
      });
    }
    if (action === "unarchive") {
  setConfirmState({
    open: true,
    action,
    taskId: task.id,
    message: `Unarchive this task: ${task.title}?`,
    confirmText: "Yes, unarchive",
  });
}

  }

  function closeConfirm() {
    if (confirmLoading) return;
    setConfirmState({
      open: false,
      action: null,
      taskId: null,
      message: "",
      confirmText: "Confirm",
    });
  }

  async function handleConfirm() {
    const { action, taskId } = confirmState;
    if (!action || !taskId) return;

    setConfirmLoading(true);
    setError("");

    try {
      if (action === "delete") {
        await deleteTask(taskId);
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      }

      if (action === "archive") {
        const updated = await archiveTask(taskId);
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      }

      if (action === "done") {
        const updated = await markTaskDone(taskId);
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      }

      if (action === "unarchive") {
  const updated = await unarchiveTask(taskId);
  setTasks((prev) =>
    prev.map((t) => (t.id === taskId ? updated : t))
  );
}


      closeConfirm();
    } catch (e) {
      setError(e.message || "Action failed");
    } finally {
      setConfirmLoading(false);
    }
  }

  const visibleTasks = useMemo(() => {
  return showArchived ? tasks : tasks.filter((t) => !t.is_archived);
}, [tasks, showArchived]);


  if (loading) return <div className="loading">Loading…</div>;

  return (
    <div className="app">
      <div className="header-row">
        <h1>Tasks</h1>

        <button className="btn btn-primary" onClick={openCreate}>
         Create Task
        </button>
      </div>

      {error ? <div className="error">{error}</div> : null}

      <label style={{ display: "block", marginBottom: 12 }}>
  <input
    type="checkbox"
    checked={showArchived}
    onChange={(e) => setShowArchived(e.target.checked)}
  />{" "}
  Show archived tasks
</label>


      <ul className="task-list">
        {visibleTasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-info">
              <span className="task-title">{task.title}</span>
              <span className="task-status">
                {STATUS_LABELS[task.status] ?? task.status}
                {task.due_date ? ` • Due: ${task.due_date}` : ""}
              </span>
            </div>

            <div className="task-actions">
              <button className="btn btn-archive" onClick={() => openEdit(task)}>
                Edit
              </button>

              <button className="btn btn-done" onClick={() => openConfirm("done", task)}>
                Done
              </button>

              {task.is_archived ? (
  <button
    className="btn btn-archive"
    onClick={() => openConfirm("unarchive", task)}
  >
    Unarchive
  </button>
) : (
  <button
    className="btn btn-archive"
    onClick={() => openConfirm("archive", task)}
  >
    Archive
  </button>
)}


              <button className="btn btn-delete" onClick={() => openConfirm("delete", task)}>
                Delete
              </button>
            </div>
          </li>
        ))}

        {visibleTasks.length === 0 ? <li className="empty">No tasks yet.</li> : null}
      </ul>

      <TaskFormModal
        open={formOpen}
        mode={formMode}
        initialTask={activeTask}
        loading={formLoading}
        onClose={closeForm}
        onSubmit={handleSubmitForm}
      />

      <ConfirmModal
        open={confirmState.open}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        loading={confirmLoading}
        onCancel={closeConfirm}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
