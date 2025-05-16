import { useEffect, useState } from "react";
import api from "../../lib/api";
import type { MyRosterAssignment } from "../../types/my";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../components/PageHeader";

export default function MyRosterPage() {
  const [assignments, setAssignments] = useState<MyRosterAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/my/roster").then((res) => {
      setAssignments(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="My Roster"
        subtitle="Your upcoming shift assignments"
      />

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Date
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Location
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Job Role
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3">{a.date}</td>
                <td className="px-4 py-3 text-gray-500">{a.locationName}</td>
                <td className="px-4 py-3 text-gray-500">{a.jobRoleName}</td>
                <td className="px-4 py-3 text-gray-500">
                  {a.startTime} – {a.endTime}
                </td>
              </tr>
            ))}
            {assignments.length === 0 && (
              <EmptyState colSpan={4} message="No shifts assigned yet" />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
