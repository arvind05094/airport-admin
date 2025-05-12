import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api";
import { AdminStaffingRequest } from "../../types/admin";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";

export default function StaffingRequestsPage() {
  const [requests, setRequests] = useState<AdminStaffingRequest[]>([]);
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

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Staffing Requests"
        subtitle="View and manage all staffing requests"
      />

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Created By</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Location</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Job Role</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Time</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Required</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3">{req.createdByFullName}</td>
                <td className="px-4 py-3 text-gray-500">{req.locationName}</td>
                <td className="px-4 py-3 text-gray-500">{req.jobRoleName}</td>
                <td className="px-4 py-3 text-gray-500">{req.date}</td>
                <td className="px-4 py-3 text-gray-500">
                  {req.startTime} - {req.endTime}
                </td>
                <td className="px-4 py-3 text-gray-500">{req.requiredCount}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={req.status} />
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
              <EmptyState colSpan={8} message="No staffing requests found" />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
