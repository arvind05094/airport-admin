import { useState } from "react";
import { toast } from "sonner";
import api, { getErrorMessage } from "../../lib/api";
import { useFetch } from "../../hooks/useFetch";
import type { MyAvailability } from "../../types/my";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../components/PageHeader";

export default function MyAvailabilityPage() {
  const {
    data: records,
    loading,
    error,
    refetch,
  } = useFetch<MyAvailability[]>("/api/my/availability");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", isAvailable: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/my/availability", form);
      toast.success("Availability updated");
      setShowForm(false);
      setForm({ date: "", isAvailable: false });
      refetch();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to submit"));
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
        title="My Availability"
        subtitle="Mark dates you are unavailable"
        action={{
          label: showForm ? "Cancel" : "Mark Date",
          onClick: () => setShowForm(!showForm),
        }}
      />

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border border-gray-200 rounded-lg p-6 mb-6 bg-white grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="text-sm font-medium block mb-1">Date</label>
            <input
              required
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) =>
                  setForm({ ...form, isAvailable: e.target.checked })
                }
                className="rounded"
              />
              Available (uncheck = unavailable)
            </label>
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Submit
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
                  Date
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {(records ?? []).map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-gray-100 last:border-0 even:bg-gray-50"
                >
                  <td className="px-4 py-3">{r.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${r.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {r.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                </tr>
              ))}
              {(records ?? []).length === 0 && (
                <EmptyState colSpan={2} message="No availability records" />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
