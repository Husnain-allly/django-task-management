import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch("/api/tasks/", {
        credentials: "include",
      });
      const data = await response.json();
      setTasks(data);
    }

    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>All Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}
