import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const adminLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Leaves", href: "/admin/leaves" },
  { label: "Shift Cover", href: "/admin/shift-cover" },
  { label: "Staffing Requests", href: "/admin/staffing-requests" },
  { label: "Locations", href: "/admin/locations" },
  { label: "Job Roles", href: "/admin/job-roles" },
  { label: "Constraint Profiles", href: "/admin/constraint-profiles" },
  { label: "Roster", href: "/admin/roster" },
  { label: "Availability", href: "/admin/availability" },
];

const staffLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Leaves", href: "/my/leaves" },
  { label: "My Shift Cover", href: "/my/shift-cover" },
  { label: "My Roster", href: "/my/roster" },
  { label: "My Availability", href: "/my/availability" },
];

const managerLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Leaves", href: "/my/leaves" },
  { label: "My Shift Cover", href: "/my/shift-cover" },
  { label: "My Roster", href: "/my/roster" },
  { label: "My Availability", href: "/my/availability" },
  { label: "Staffing Requests", href: "/my/staffing-requests" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  const links =
    user?.role === "Admin"
      ? adminLinks
      : user?.role === "Manager" || user?.role === "Supervisor"
        ? managerLinks
        : staffLinks;

  return (
    <aside className="w-56 min-h-screen border-r border-gray-200 flex flex-col bg-white">
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="font-semibold text-sm tracking-wide uppercase">
          Airport Admin
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">{user?.role}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`block px-3 py-2 rounded-md text-sm transition-colors`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full text-left text-sm text-gray-500 hover:text-black transition"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
