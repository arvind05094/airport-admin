import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api";

interface ShiftCover {
  id: number;
  requesterFullName: string;
  shiftDate: string;
  shiftStartTime: string;
  shiftEndTime: string;
  reason: string;
  status: string;
}

export default function ShiftCoverPage() {
  const [requests, setRequests] = useState<ShiftCover[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    api.get("/api/admin/shift-cover").then((res) => {
      setRequests(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      await api.put(`/api/admin/shift-cover/${id}/${action}`);
      toast.success(`Request ${action}d`);
      fetchRequests();
    } catch {
      toast.error(`Failed to ${action} request`);
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Shift Cover Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage shift cover requests
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
                Shift Date
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Time
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
            {requests.map((req) => (
              <tr
                key={req.id}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-4 py-3">{req.requesterFullName}</td>
                <td className="px-4 py-3 text-gray-500">{req.shiftDate}</td>
                <td className="px-4 py-3 text-gray-500">
                  {req.shiftStartTime} - {req.shiftEndTime}
                </td>
                <td className="px-4 py-3 text-gray-500">{req.reason}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs border ${
                      req.status === "Approved"
                        ? "border-green-300 text-green-700"
                        : req.status === "Rejected"
                          ? "border-red-300 text-red-700"
                          : "border-gray-300 text-gray-600"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {req.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleAction(req.id, "approve")}
                        className="text-xs text-green-600 hover:text-green-800 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "reject")}
                        className="text-xs text-red-500 hover:text-red-700 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-400 text-sm"
                >
                  No shift cover requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
