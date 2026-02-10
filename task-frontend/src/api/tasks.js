import { apiFetch } from "./client";

async function handleJson(res, fallbackMessage) {
  if (!res.ok) {
    let detail = "";
    try {
      const data = await res.json();
      detail = JSON.stringify(data);
    } catch {}
    throw new Error(detail || fallbackMessage);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function fetchTasks() {
  const res = await apiFetch("/api/tasks/");
  return handleJson(res, "Failed to fetch tasks");
}

export async function createTask(payload) {
  const res = await apiFetch("/api/tasks/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJson(res, "Failed to create task");
}

export async function updateTask(id, payload) {
  const res = await apiFetch(`/api/tasks/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJson(res, "Failed to update task");
}

export async function deleteTask(id) {
  const res = await apiFetch(`/api/tasks/${id}/`, {
    method: "DELETE",
  });
  await handleJson(res, "Failed to delete task");
  return true;
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
