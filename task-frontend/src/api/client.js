const API_BASE = "http://127.0.0.1:8000";

function getCookie(name) {
  const match = document.cookie.match(
    new RegExp("(^|; )" + name + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[2]) : null;
}

export async function apiFetch(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers || {});

  // Add CSRF for unsafe methods
  if (!["GET", "HEAD", "OPTIONS", "TRACE"].includes(method)) {
    const csrf = getCookie("csrftoken");
    if (csrf) headers.set("X-CSRFToken", csrf);
  }

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
}
