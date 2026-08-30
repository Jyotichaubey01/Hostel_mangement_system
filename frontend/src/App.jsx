import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Login */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />

                {/* Student */}
                <Route
                    path="/student"
                    element={<StudentDashboard />}
                />

                {/* Admin */}
                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                {/* Unknown URL */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;