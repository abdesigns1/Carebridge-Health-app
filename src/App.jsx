import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import HealthLogger from "./pages/HealthLogger";
import HealthAssistant from "./components/HealthAssistant";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/health-logger" element={<HealthLogger />} />
        <Route path="/assistant" element={<HealthAssistant />} />
      </Routes>
    </Router>
  );
}
