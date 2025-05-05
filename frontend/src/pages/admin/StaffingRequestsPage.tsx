import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api";

interface StaffingRequest {
  id: number;
  createdByFullName: string;
  locationName: string;
  jobRoleName: string;
  date: string;
  startTime: string;
  endTime: string;
  requiredCount: number;
  status: string;
}

export default function StaffingRequestsPage() {
  const [requests, setRequests] = useState<StaffingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    api.get("/api/admin/staffing-requests").then((res) => {
      setRequests(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleFulfil = async (id: number) => {
    try {
      await api.put(`/api/admin/staffing-requests/${id}/fulfil`);
      toast.success("Request marked as fulfilled");
      fetchRequests();
    } catch {
      toast.error("Failed to fulfil request");
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Staffing Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage all staffing requests
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Created By
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Location
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Job Role
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Date
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Time
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Required
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
                <td className="px-4 py-3">{req.createdByFullName}</td>
                <td className="px-4 py-3 text-gray-500">{req.locationName}</td>
                <td className="px-4 py-3 text-gray-500">{req.jobRoleName}</td>
                <td className="px-4 py-3 text-gray-500">{req.date}</td>
                <td className="px-4 py-3 text-gray-500">
                  {req.startTime} - {req.endTime}
                </td>
                <td className="px-4 py-3 text-gray-500">{req.requiredCount}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs border ${
                      req.status === "Fulfilled"
                        ? "border-green-300 text-green-700"
                        : req.status === "Cancelled"
                          ? "border-red-300 text-red-700"
                          : "border-gray-300 text-gray-600"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {req.status === "Pending" && (
                    <button
                      onClick={() => handleFulfil(req.id)}
                      className="text-xs text-green-600 hover:text-green-800 transition"
                    >
                      Fulfil
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-gray-400 text-sm"
                >
                  No staffing requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
