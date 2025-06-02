import { useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import type { Location } from "@/types/common";

export default function LocationsPage() {
  const {
    data: locations,
    loading,
    error,
    refetch,
  } = useFetch<Location[]>("/api/admin/locations");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/locations", { name });
      toast.success("Location created");
      setShowForm(false);
      setName("");
      refetch();
    } catch {
      toast.error("Failed to create location");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this location?")) return;
    try {
      await api.delete(`/api/admin/locations/${id}`);
      toast.success("Location deleted");
      refetch();
    } catch {
      toast.error("Failed to delete location");
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
        title="Locations"
        subtitle="Manage airport locations"
        action={{
          label: showForm ? "Cancel" : "Add Location",
          onClick: () => setShowForm(!showForm),
        }}
      />

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border border-gray-200 rounded-lg p-6 mb-6 bg-white flex gap-4"
        >
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Location name"
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
        <div className="overflow-x-auto">
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
              {(locations ?? []).map((loc) => (
                <tr
                  key={loc.id}
                  className="border-b border-gray-100 last:border-0 even:bg-gray-50"
                >
                  <td className="px-4 py-3">{loc.name}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(loc.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {(locations ?? []).length === 0 && (
                <EmptyState colSpan={2} message="No locations found" />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
