import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api";

interface Leave {
  id: number;
  userFullName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  createdAt: string;
}

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
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

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Leave Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage staff leave requests
        </p>
      </div>

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
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-4 py-3">{leave.userFullName}</td>
                <td className="px-4 py-3 text-gray-500">{leave.startDate}</td>
                <td className="px-4 py-3 text-gray-500">{leave.endDate}</td>
                <td className="px-4 py-3 text-gray-500">{leave.reason}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs border ${
                      leave.status === "Approved"
                        ? "border-green-300 text-green-700"
                        : leave.status === "Rejected"
                          ? "border-red-300 text-red-700"
                          : "border-gray-300 text-gray-600"
                    }`}
                  >
                    {leave.status}
                  </span>
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
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-400 text-sm"
                >
                  No leave requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
