import { useEffect, useState } from "react";
import api, { formatDate, formatTime } from "../../lib/api";
import type { MyShiftCover } from "../../types/my";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";

export default function MyShiftCoverPage() {
  const [requests, setRequests] = useState<MyShiftCover[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/my/shift-cover").then((res) => {
      setRequests(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="My Shift Cover"
        subtitle="History of your shift cover requests"
      />

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
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
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req.id}
                className="border-b border-gray-100 last:border-0 even:bg-gray-50"
              >
                <td className="px-4 py-3">{formatDate(req.shiftDate)}</td>
                <td className="px-4 py-3 text-gray-500">
                  {formatTime(req.shiftStartTime)} -{" "}
                  {formatTime(req.shiftEndTime)}
                </td>
                <td className="px-4 py-3 text-gray-500">{req.reason}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={req.status} />
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <EmptyState colSpan={4} message="No shift cover requests found" />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
