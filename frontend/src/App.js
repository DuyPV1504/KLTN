import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import History from "./pages/user/History";
import Practice from "./pages/user/Practice";
import Advice from "./pages/user/Advice";
import HistoryDetail from './pages/user/HistoryDetail';
import Statistics from "./pages/user/Statistics";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />  
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/history" element={<HistoryDetail />} />
        <Route path="/history/:id" element={<HistoryDetail />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/advice" element={<Advice />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </Router>
  );
}

export default App;


