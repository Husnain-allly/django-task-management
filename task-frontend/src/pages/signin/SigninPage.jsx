import { useState } from "react";
import { useNavigate } from "react-router-dom";  
import { loginUser } from "../../api/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!username || !password) {
      setError("Please fill in both fields.");
      setLoading(false);
      return;
    }

    try {
  const user = await loginUser(username, password);

  if (user.is_staff || user.is_superuser) {
    navigate("/admin-dashboard"); 
  } else {
    navigate("/tasks");
  }
} catch (e) {
  setError(e.message || "Login failed. Please try again.");
  setLoading(false);
}
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>Don't have an account? <button onClick={() => navigate("/signup")}>Sign up</button></p>
    </div>
  );
}
