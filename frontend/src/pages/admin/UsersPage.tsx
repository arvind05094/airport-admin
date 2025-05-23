import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../components/PageHeader";
import type { ConstraintProfile, JobRole } from "@/types/common";
import type { AdminUser } from "@/types/admin";

interface CreateForm {
  fullName: string;
  email: string;
  password: string;
  role: string;
  jobRoleId: number | null;
  constraintProfileId: number | null;
}

const emptyForm: CreateForm = {
  fullName: "",
  email: "",
  password: "",
  role: "Crew",
  jobRoleId: null,
  constraintProfileId: null,
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [constraintProfiles, setConstraintProfiles] = useState<
    ConstraintProfile[]
  >([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateForm>(emptyForm);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    api.get("/api/admin/users").then((res) => {
      setUsers(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUsers();
    api.get("/api/admin/job-roles").then((res) => setJobRoles(res.data));
    api
      .get("/api/admin/constraint-profiles")
      .then((res) => setConstraintProfiles(res.data));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/users", form);
      toast.success("User created");
      setShowForm(false);
      setForm(emptyForm);
      fetchUsers();
    } catch {
      toast.error("Failed to create user");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage system users"
        action={{
          label: showForm ? "Cancel" : "Add User",
          onClick: () => setShowForm(!showForm),
        }}
      />

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border border-gray-200 rounded-lg p-6 mb-6 bg-white grid grid-cols-2 gap-4"
        >
          <div>
            <label className="text-sm font-medium block mb-1">Full Name</label>
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="Crew">Crew</option>
              <option value="Manager">Manager</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Job Role</label>
            <select
              value={form.jobRoleId ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  jobRoleId: e.target.value ? +e.target.value : null,
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">None</option>
              {jobRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Constraint Profile
            </label>
            <select
              value={form.constraintProfileId ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  constraintProfileId: e.target.value ? +e.target.value : null,
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">None</option>
              {constraintProfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Create User
            </button>
          </div>
        </form>
      )}

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Email
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Role
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Job Role
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Constraint Profile
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 last:border-0 even:bg-gray-50"
              >
                <td className="px-4 py-3">{user.fullName}</td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="inline-block border border-gray-300 rounded px-2 py-0.5 text-xs">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {user.jobRoleName ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {user.constraintProfileName ?? "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-xs text-red-500 hover:text-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <EmptyState colSpan={6} message="No users found" />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
