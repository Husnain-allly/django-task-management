import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TasksDashboard from './pages/taskfeatures/TasksDashboard';
import LoginPage from './pages/signin/SigninPage';
import AdminDashboard from './pages/taskfeatures/AdminDashboard'
import SignupPage from './pages/signup/SignupPage'
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TasksDashboard />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/admin-dashboard" element={<AdminDashboard />}  />
         <Route path="/tasks" element={<TasksDashboard />} />
         <Route path="/signup" element={<SignupPage />} /> 
      </Routes>
    </Router>
  );
}
