import { useEffect, useMemo, useState } from "react";
import {
  fetchTasks,
  deleteTask,
  archiveTask,
  unarchiveTask,
  markTaskDone,
  createTask,
  updateTask,
} from "../../api/tasks";
import { fetchMe } from "../../api/auth";

import ConfirmModal  from '../../components/common/ConfirmModal'
import TaskFormModal  from '../../components/common/TaskFormModal'
import {STATUS_LABELS} from '../../enums/statusLabels'
import { useNavigate } from "react-router-dom";


export default function TasksDashboard() {
  const navigate = useNavigate()
  const [me, setMe] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [confirmState, setConfirmState] = useState({
    open: false,
    action: null,
    taskId: null,
    message: "",
    confirmText: "Confirm",
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [activeTask, setActiveTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setAuthLoading(true);
      try {
        const user = await fetchMe();
        if (!cancelled) setMe(user);
      } catch {
        if (!cancelled) setMe(null);
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!me) return;

    let cancelled = false;

    async function loadTasks() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchTasks();
        if (!cancelled) setTasks(Array.isArray(data) ? data : data?.results ?? []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load tasks");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTasks();
    return () => {
      cancelled = true;
    };
  }, [me]);

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const user = await fetchMe();
        if (user) {
          if (user.is_staff) {
            navigate("/admin-dashboard");
          } else {
            navigate("/tasks");
          }
        }
      } catch {
        navigate("/login");
      }
    }

    checkAuthentication();
  }, [navigate]);  


useEffect(() => {
  let cancelled = false;

  async function init() {
    setAuthLoading(true);
    try {
      const user = await fetchMe();
      if (!cancelled) setMe(user);
    } catch {
      if (!cancelled) setMe(null);
      navigate("/login");
    } finally {
      if (!cancelled) setAuthLoading(false);
    }
  }

  init();
  return () => {
    cancelled = true;
  };
}, []);

useEffect(() => {
  let cancelled = false;

  async function init() {
    setAuthLoading(true);
    try {
      const user = await fetchMe();
      if (!cancelled) setMe(user);
    } catch {
      if (!cancelled) setMe(null);
      navigate("/login");
    } finally {
      if (!cancelled) setAuthLoading(false);
    }
  }

  init();
  return () => {
    cancelled = true;
  };
}, []);




  const visibleTasks = useMemo(() => {
    return showArchived ? tasks : tasks.filter((t) => !t.is_archived);
  }, [tasks, showArchived]);

  function openCreate() {
    setFormMode("create");
    setActiveTask(null);
    setFormOpen(true);
  }

  function openEdit(task) {
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
    } finally {
      setFormLoading(false);
    }
  }

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

      if (action === "unarchive") {
        const updated = await unarchiveTask(taskId);
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      }

      if (action === "done") {
        const updated = await markTaskDone(taskId);
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      }

      closeConfirm();
    } catch (e) {
      setError(e.message || "Action failed");
    } finally {
      setConfirmLoading(false);
    }
  }
  if (authLoading) return <div className="loading">Checking session…</div>;


  return (
    <div className="app">
      <div className="header-row"> 
          <h1>Tasks</h1>
        <div className="header-actions">

          <button className="btn btn-primary" onClick={openCreate}>
            + Create Task
          </button>
        </div>
      </div>

      {error ? <div className="error">{error}</div> : null}

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={showArchived}
          onChange={(e) => setShowArchived(e.target.checked)}
        />
        Show archived
      </label>

      {loading ? (
        <div className="loading">Loading tasks…</div>
      ) : (
        <ul className="task-list">
          {visibleTasks.map((task) => (
            <li
              key={task.id}
              className={`task-item ${task.is_archived ? "archived" : ""}`}
            >
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

                <button
                  className="btn btn-done"
                  onClick={() => openConfirm("done", task)}
                  disabled={task.is_archived}
                >
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
      )}

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
