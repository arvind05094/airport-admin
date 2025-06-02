import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import type {
  AdminUser,
  AdminLeave,
  AdminShiftCover,
  AdminStaffingRequest,
} from "../types/admin";

interface Stats {
  totalUsers: number;
  pendingLeaves: number;
  pendingShiftCover: number;
  pendingStaffingRequests: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const { data: users } = useFetch<AdminUser[]>(
    isAdmin ? "/api/admin/users" : "",
  );
  const { data: leaves } = useFetch<AdminLeave[]>(
    isAdmin ? "/api/admin/leaves" : "",
  );
  const { data: shiftCover } = useFetch<AdminShiftCover[]>(
    isAdmin ? "/api/admin/shift-cover" : "",
  );
  const { data: staffing } = useFetch<AdminStaffingRequest[]>(
    isAdmin ? "/api/admin/staffing-requests" : "",
  );

  const stats: Stats | null =
    isAdmin && users && leaves && shiftCover && staffing
      ? {
          totalUsers: users.length,
          pendingLeaves: leaves.filter((l) => l.status === "Pending").length,
          pendingShiftCover: shiftCover.filter((s) => s.status === "Pending")
            .length,
          pendingStaffingRequests: staffing.filter(
            (s) => s.status === "Pending",
          ).length,
        }
      : null;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-gray-500 mt-1 mb-8">
        Welcome back, {user?.email}
      </p>

      {isAdmin && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Pending Leaves" value={stats.pendingLeaves} />
          <StatCard
            label="Pending Shift Cover"
            value={stats.pendingShiftCover}
          />
          <StatCard
            label="Pending Staffing"
            value={stats.pendingStaffingRequests}
          />
        </div>
      )}

      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickLink
            label="My Leaves"
            href="/my/leaves"
            description="View and manage your leave requests"
          />
          <QuickLink
            label="My Shift Cover"
            href="/my/shift-cover"
            description="View and manage shift cover requests"
          />
          <QuickLink
            label="My Roster"
            href="/my/roster"
            description="View your assigned shifts"
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function QuickLink({
  label,
  href,
  description,
}: {
  label: string;
  href: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="border border-gray-200 rounded-lg p-5 bg-white hover:border-black transition block"
    >
      <p className="font-medium text-sm">{label}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </a>
  );
}
