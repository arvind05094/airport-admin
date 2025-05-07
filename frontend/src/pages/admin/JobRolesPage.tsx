import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api";

interface JobRole {
  id: number;
  name: string;
}

export default function JobRolesPage() {
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchJobRoles = () => {
    api.get("/api/admin/job-roles").then((res) => {
      setJobRoles(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchJobRoles();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/job-roles", { name });
      toast.success("Job role created");
      setShowForm(false);
      setName("");
      fetchJobRoles();
    } catch {
      toast.error("Failed to create job role");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this job role?")) return;
    try {
      await api.delete(`/api/admin/job-roles/${id}`);
      toast.success("Job role deleted");
      fetchJobRoles();
    } catch {
      toast.error("Failed to delete job role");
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Job Roles</h1>
          <p className="text-sm text-gray-500 mt-1">Manage job roles</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          {showForm ? "Cancel" : "Add Job Role"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border border-gray-200 rounded-lg p-6 mb-6 bg-white flex gap-4"
        >
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Job role name"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button
            type="submit"
            className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Create
          </button>
        </form>
      )}

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {jobRoles.map((role) => (
              <tr
                key={role.id}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-4 py-3">{role.name}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="text-xs text-red-500 hover:text-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {jobRoles.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center text-gray-400 text-sm"
                >
                  No job roles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
