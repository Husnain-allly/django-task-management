const API_BASE = "http://127.0.0.1:8000";

async function handleJson(res, fallbackMessage) {
  if (!res.ok) {
    let detail = "";
    try {
      const data = await res.json();
      detail = JSON.stringify(data);
    } catch {
      // ignore
    }
    throw new Error(detail || fallbackMessage);
  }
  if (res.status === 204) return null;
  return await res.json();
}

export async function fetchTasks() {
  const res = await fetch(`${API_BASE}/api/tasks/`);
  const data = await handleJson(res, "Failed to fetch tasks");
  return data; // should be an array
}

export async function createTask(payload) {
  const res = await fetch(`${API_BASE}/api/tasks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await handleJson(res, "Failed to create task");
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/api/tasks/${id}/`, {
    method: "DELETE",
  });
  await handleJson(res, "Failed to delete task");
  return true;
}

export async function updateTask(id, payload) {
  const res = await fetch(`${API_BASE}/api/tasks/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await handleJson(res, "Failed to update task");
}

export async function archiveTask(id) {
  return updateTask(id, { is_archived: true });
}

export async function markTaskDone(id) {
  return updateTask(id, { status: "done" });
}

export async function unarchiveTask(id) {
  return updateTask(id, { is_archived: false });
}
