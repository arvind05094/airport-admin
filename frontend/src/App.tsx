import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MainLayout from "./components/layout/MainLayout";
import UsersPage from "./pages/admin/UsersPage";
import MyLeavesPage from "./pages/my/MyLeavesPage";
import LeavesPage from "./pages/admin/LeavesPage";
import ShiftCoverPage from "./pages/admin/ShiftCoverPage";
import MyShiftCoverPage from "./pages/my/MyShiftCoverPage";
import StaffingRequestsPage from "./pages/admin/StaffingRequestsPage";
import MyStaffingRequestsPage from "./pages/my/MyStaffingRequestsPage";
import ConstraintProfilesPage from "./pages/admin/ConstraintProfilesPage";
import JobRolesPage from "./pages/admin/JobRolesPage";
import LocationsPage from "./pages/admin/LocationsPage";
import AvailabilityPage from "./pages/admin/AvailabilityPage";
import MyAvailabilityPage from "./pages/my/MyAvailabilityPage";
import MyRosterPage from "./pages/my/MyRosterPage";
import StaffingRequestDetailPage from "./pages/StaffingRequestDetailPage";

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
        <Route path="/admin/shift-cover" element={<ShiftCoverPage />} />
        <Route path="/my/shift-cover" element={<MyShiftCoverPage />} />
        <Route
          path="/admin/staffing-requests"
          element={<StaffingRequestsPage />}
        />
        <Route
          path="/my/staffing-requests"
          element={<MyStaffingRequestsPage />}
        />
        <Route path="/admin/locations" element={<LocationsPage />} />
        <Route path="/admin/job-roles" element={<JobRolesPage />} />
        <Route
          path="/admin/constraint-profiles"
          element={<ConstraintProfilesPage />}
        />
        <Route path="/my/roster" element={<MyRosterPage />} />
        <Route path="/my/availability" element={<MyAvailabilityPage />} />
        <Route path="/admin/availability" element={<AvailabilityPage />} />
        <Route
          path="/staffing-requests/:id"
          element={<StaffingRequestDetailPage />}
        />
      </Route>

      {/* Fallback for 404s */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
