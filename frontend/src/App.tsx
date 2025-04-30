import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MainLayout from "./components/layout/MainLayout";
import UsersPage from "./pages/admin/UsersPage";
import MyLeavesPage from "./pages/my/MyLeavesPage";
import LeavesPage from "./pages/admin/LeavesPage";

function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
  const { user } = useAuth();

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/unauthorized"
        element={<div className="p-8 text-center">Unauthorized</div>}
      />

      {/* Protected Routes Wrapper */}
      <Route element={<ProtectedRoute />}>
        {/* All routes inside here automatically get wrapped in MainLayout and are secured */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/leaves" element={<LeavesPage />} />
        <Route path="/my/leaves" element={<MyLeavesPage />} />
      </Route>

      {/* Fallback for 404s */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
