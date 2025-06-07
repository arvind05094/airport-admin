import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  { label: "My Roster", href: "/my/roster" },
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
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links =
    user?.role === "Admin"
      ? adminLinks
      : user?.role === "Manager" || user?.role === "Supervisor"
        ? managerLinks
        : staffLinks;

  const navContent = (
    <>
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="font-semibold text-sm tracking-wide uppercase">
          Airport Admin
        </h1>
        <p className="text-xs font-medium text-gray-700 mt-0.5">
          {user?.email}
        </p>
        <p className="text-xs text-gray-500">{user?.role}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            onClick={() => setOpen(false)}
            className={`block px-3 py-2 rounded-md text-sm transition-colors ${
              location.pathname === link.href
                ? "bg-gray-100 font-medium"
                : "hover:bg-gray-50"
            }`}
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
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white border border-gray-200 rounded-md p-2 shadow-sm"
      >
        <div className="w-4 h-0.5 bg-gray-600 mb-1" />
        <div className="w-4 h-0.5 bg-gray-600 mb-1" />
        <div className="w-4 h-0.5 bg-gray-600" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-56 bg-white z-50 flex flex-col border-r border-gray-200 transform transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 min-h-screen border-r border-gray-200 flex-col bg-white">
        {navContent}
      </aside>
    </>
  );
}
