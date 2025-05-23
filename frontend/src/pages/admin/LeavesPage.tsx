import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import type { AdminLeave } from "@/types/admin";

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<AdminLeave[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = () => {
    api.get("/api/admin/leaves").then((res) => {
      setLeaves(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      await api.put(`/api/admin/leaves/${id}/${action}`);
      toast.success(`Leave ${action}d`);
      fetchLeaves();
    } catch {
      toast.error(`Failed to ${action} leave`);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Leave Requests"
        subtitle="Review and manage staff leave requests"
      />

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Staff
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Start Date
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                End Date
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Reason
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr
                key={leave.id}
                className="border-b border-gray-100 last:border-0 even:bg-gray-50"
              >
                <td className="px-4 py-3">{leave.userFullName}</td>
                <td className="px-4 py-3 text-gray-500">{leave.startDate}</td>
                <td className="px-4 py-3 text-gray-500">{leave.endDate}</td>
                <td className="px-4 py-3 text-gray-500">{leave.reason}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={leave.status} />
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {leave.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleAction(leave.id, "approve")}
                        className="text-xs text-green-600 hover:text-green-800 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(leave.id, "reject")}
                        className="text-xs text-red-500 hover:text-red-700 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {leaves.length === 0 && (
              <EmptyState colSpan={6} message="No leave requests found" />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
