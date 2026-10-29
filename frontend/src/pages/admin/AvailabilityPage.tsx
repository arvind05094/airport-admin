import { useState } from "react";
import { toast } from "sonner";
import api, { formatDate } from "../../lib/api";
import { useFetch } from "../../hooks/useFetch";
import type { AdminAvailability } from "../../types/admin";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";

export default function AvailabilityPage() {
  const {
    data: records,
    loading,
    error,
    refetch,
  } = useFetch<AdminAvailability[]>("/api/admin/availability");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleAvailability = async (id: number, currentStatus: boolean) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.patch(`/api/admin/availability/${id}`, {
        isAvailable: !currentStatus,
      });
      toast.success("Availability status updated");
      refetch();
    } catch (err: unknown) {
      let message = "Failed to update availability status";
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        message = axiosErr.response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
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
        title="Availability"
        subtitle="Staff unavailability overview"
      />

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Staff
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {(records ?? []).map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-gray-100 last:border-0 even:bg-gray-50"
                >
                  <td className="px-4 py-3">{r.userFullName}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(r.date)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        r.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleToggleAvailability(r.id, r.isAvailable)}
                      disabled={isSubmitting}
                      className="text-xs border border-gray-300 rounded px-2 py-1 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Updating..." : "Toggle Status"}
                    </button>
                  </td>
                </tr>
              ))}
              {(records ?? []).length === 0 && (
                <EmptyState colSpan={4} message="No availability records found" />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}