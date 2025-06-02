import { useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import type { ConstraintProfile } from "@/types/common";

interface CreateForm {
  name: string;
  maxHoursPerDay: number;
  maxHoursPerWeek: number;
  maxConsecutiveDays: number;
}

const emptyForm: CreateForm = {
  name: "",
  maxHoursPerDay: 8,
  maxHoursPerWeek: 40,
  maxConsecutiveDays: 5,
};

export default function ConstraintProfilesPage() {
  const {
    data: profiles,
    loading,
    error,
    refetch,
  } = useFetch<ConstraintProfile[]>("/api/admin/constraint-profiles");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateForm>(emptyForm);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/constraint-profiles", form);
      toast.success("Constraint profile created");
      setShowForm(false);
      setForm(emptyForm);
      refetch();
    } catch {
      toast.error("Failed to create constraint profile");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this profile?")) return;
    try {
      await api.delete(`/api/admin/constraint-profiles/${id}`);
      toast.success("Profile deleted");
      refetch();
    } catch {
      toast.error("Failed to delete profile");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-center py-12 text-red-500 text-sm">{error}</div>
    );
  return (
    <div>
      <PageHeader
        title="Constraint Profiles"
        subtitle="Manage staff constraint profiles"
        action={{
          label: showForm ? "Cancel" : "Add Profile",
          onClick: () => setShowForm(!showForm),
        }}
      />

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border border-gray-200 rounded-lg p-6 mb-6 bg-white grid grid-cols-1 md:grid-cols-2 gap-4"
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
        <div className="overflow-x-auto">
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
              {(profiles ?? []).map((profile) => (
                <tr
                  key={profile.id}
                  className="border-b border-gray-100 last:border-0 even:bg-gray-50"
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
                      className="text-xs text-red-500 hover:text-red-700 border border-red-300 rounded px-2 py-1 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {(profiles ?? []).length === 0 && (
                <EmptyState
                  colSpan={5}
                  message="No constraint profiles found"
                />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
