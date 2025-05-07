import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api";

interface ConstraintProfile {
  id: number;
  name: string;
  maxHoursPerDay: number;
  maxHoursPerWeek: number;
  maxConsecutiveDays: number;
}

interface CreateForm {
  name: string;
  maxHoursPerDay: number;
  maxHoursPerWeek: number;
  maxConsecutiveDays: number;
}

export default function ConstraintProfilesPage() {
  const [profiles, setProfiles] = useState<ConstraintProfile[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateForm>({
    name: "",
    maxHoursPerDay: 8,
    maxHoursPerWeek: 40,
    maxConsecutiveDays: 5,
  });
  const [loading, setLoading] = useState(true);

  const fetchProfiles = () => {
    api.get("/api/admin/constraint-profiles").then((res) => {
      setProfiles(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/constraint-profiles", form);
      toast.success("Constraint profile created");
      setShowForm(false);
      setForm({
        name: "",
        maxHoursPerDay: 8,
        maxHoursPerWeek: 40,
        maxConsecutiveDays: 5,
      });
      fetchProfiles();
    } catch {
      toast.error("Failed to create constraint profile");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this profile?")) return;
    try {
      await api.delete(`/api/admin/constraint-profiles/${id}`);
      toast.success("Profile deleted");
      fetchProfiles();
    } catch {
      toast.error("Failed to delete profile");
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Constraint Profiles</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage staff constraint profiles
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          {showForm ? "Cancel" : "Add Profile"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border border-gray-200 rounded-lg p-6 mb-6 bg-white grid grid-cols-2 gap-4"
        >
          <div>
            <label className="text-sm font-medium block mb-1">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Max Hours/Day
            </label>
            <input
              required
              type="number"
              min={1}
              max={24}
              value={form.maxHoursPerDay}
              onChange={(e) =>
                setForm({ ...form, maxHoursPerDay: +e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Max Hours/Week
            </label>
            <input
              required
              type="number"
              min={1}
              max={168}
              value={form.maxHoursPerWeek}
              onChange={(e) =>
                setForm({ ...form, maxHoursPerWeek: +e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Max Consecutive Days
            </label>
            <input
              required
              type="number"
              min={1}
              max={7}
              value={form.maxConsecutiveDays}
              onChange={(e) =>
                setForm({ ...form, maxConsecutiveDays: +e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Create
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
                Max Hrs/Day
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Max Hrs/Week
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Max Consecutive Days
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr
                key={profile.id}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-4 py-3">{profile.name}</td>
                <td className="px-4 py-3 text-gray-500">
                  {profile.maxHoursPerDay}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {profile.maxHoursPerWeek}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {profile.maxConsecutiveDays}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className="text-xs text-red-500 hover:text-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {profiles.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-400 text-sm"
                >
                  No constraint profiles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
