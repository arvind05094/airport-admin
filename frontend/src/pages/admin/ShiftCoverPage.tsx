import { useState } from "react";
import { toast } from "sonner";
import api, { formatDate, formatTime, getErrorMessage } from "../../lib/api";
import { useFetch } from "../../hooks/useFetch";
import type { AdminShiftCover, AdminUser } from "../../types/admin";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";

export default function ShiftCoverPage() {
  const {
    data: requests,
    loading,
    error,
    refetch,
  } = useFetch<AdminShiftCover[]>("/api/admin/shift-cover");
  const { data: users } = useFetch<AdminUser[]>("/api/admin/users");
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [coveredById, setCoveredById] = useState<number>(0);

  const handleApprove = async (id: number) => {
    if (!coveredById) {
      toast.error("Please select a covering staff member");
      return;
    }
    try {
      await api.put(`/api/admin/shift-cover/${id}/approve`, { coveredById });
      toast.success("Request approved and shift reassigned");
      setApprovingId(null);
      setCoveredById(0);
      refetch();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to approve request"));
    }
  };

  const handleReject = async (id: number) => {
    try {
      await api.put(`/api/admin/shift-cover/${id}/reject`);
      toast.success("Request rejected");
      refetch();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to reject request"));
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
        title="Shift Cover Requests"
        subtitle="Review and manage shift cover requests"
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
                  Shift Date
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Time
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Reason
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Covered By
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {(requests ?? []).map((req) => (
                <>
                  <tr
                    key={req.id}
                    className="border-b border-gray-100 last:border-0 even:bg-gray-50"
                  >
                    <td className="px-4 py-3">{req.requesterFullName}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDate(req.shiftDate)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatTime(req.shiftStartTime)} -{" "}
                      {formatTime(req.shiftEndTime)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{req.reason}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {req.coveredByFullName ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {req.status === "Pending" && (
                        <>
                          <button
                            onClick={() => {
                              setApprovingId(req.id);
                              setCoveredById(0);
                            }}
                            className="text-xs text-green-600 hover:text-green-800 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            className="text-xs text-red-500 hover:text-red-700 transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                  {approvingId === req.id && (
                    <tr
                      key={`approve-${req.id}`}
                      className="bg-green-50 border-b border-gray-100"
                    >
                      <td colSpan={7} className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <select
                            value={coveredById}
                            onChange={(e) => setCoveredById(+e.target.value)}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                          >
                            <option value={0}>Select covering staff...</option>
                            {(users ?? [])
                              .filter((u) => u.id !== req.requesterId)
                              .map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.fullName}
                                </option>
                              ))}
                          </select>
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="bg-black text-white text-sm px-4 py-1.5 rounded-md hover:bg-gray-800 transition"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setApprovingId(null)}
                            className="text-sm text-gray-500 hover:text-black transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {(requests ?? []).length === 0 && (
                <EmptyState
                  colSpan={7}
                  message="No shift cover requests found"
                />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
