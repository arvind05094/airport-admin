import { toast } from "sonner";
import api, { formatDate } from "../../lib/api";
import { useFetch } from "../../hooks/useFetch";
import type { AdminStaffingRequest } from "../../types/admin";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { useNavigate } from "react-router-dom";

export default function StaffingRequestsPage() {
  const navigate = useNavigate();
  const {
    data: requests,
    loading,
    error,
    refetch,
  } = useFetch<AdminStaffingRequest[]>("/api/admin/staffing-requests");

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-center py-12 text-red-500 text-sm">{error}</div>
    );
  return (
    <div>
      <PageHeader
        title="Staffing Requests"
        subtitle="View and manage all staffing requests"
      />

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="overflow-x-auto">
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
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {(requests ?? []).map((req) => (
                <tr
                  key={req.id}
                  onClick={() => navigate(`/staffing-requests/${req.id}`)}
                  className="border-b border-gray-100 last:border-0 even:bg-gray-50 cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-4 py-3">{req.createdByFullName}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {req.locationName}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{req.jobRoleName}</td>
                  <td className="px-4 py-3 text-gray-500">{req.date}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {req.startTime} - {req.endTime}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {req.requiredCount}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(req.createdAt)}
                  </td>
                </tr>
              ))}
              {(requests ?? []).length === 0 && (
                <EmptyState colSpan={9} message="No staffing requests found" />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
