
const API_BASE = "http://127.0.0.1:8000";

export async function fetchMe() {
  const res = await fetch(`${API_BASE}/api/me/`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
  }

  return await res.json();
}
// Helper function to get the CSRF token from cookies
function getCSRFToken() {
  const csrfToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
  if (csrfToken) {
    return csrfToken.split('=')[1];  // Extract and return the CSRF token value
  }
  return null;
}

// Login user function with automatic CSRF token handling
export async function loginUser(username, password) {
  const csrfToken = getCSRFToken(); // ✅ ADD
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const res = await fetch(`${API_BASE}/api/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", 
      "X-CSRFToken": csrfToken,  // Ensure data is sent as URL encoded
    },
    body: formData.toString(),
    credentials: "include",  // This ensures that the session cookie (and csrftoken) is sent automatically
  });

  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = "Login failed. Please try again.";
    if (errorText.includes("username") || errorText.includes("password")) {
      errorMessage = "Invalid credentials. Please check your username and password.";
    }

    throw new Error(errorMessage);
  }

  return await res.json();  
}

// Signup function with automatic CSRF token handling
export async function signupUser(username, email, password) {
  const csrfToken = getCSRFToken();
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);

  const res = await fetch(`${API_BASE}/api/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", 
      "X-CSRFToken": csrfToken,  // Send data as URL encoded
    },
    body: formData.toString(),
    credentials: "include",  // This ensures that the session cookie (and csrftoken) is sent automatically
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Signup failed. Please try again.");
  }

  return await res.json();  // Successful signup response
}
