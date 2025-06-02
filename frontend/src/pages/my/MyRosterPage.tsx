import { useState } from "react";
import { toast } from "sonner";
import api, { formatDate, formatTime, getErrorMessage } from "../../lib/api";
import { useFetch } from "../../hooks/useFetch";
import type { MyRosterAssignment } from "../../types/my";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../components/PageHeader";

export default function MyRosterPage() {
  const {
    data: assignments,
    loading,
    error,
  } = useFetch<MyRosterAssignment[]>("/api/my/roster");
  const [coveringId, setCoveringId] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRequestCover = async (assignmentId: number) => {
    setSubmitting(true);
    try {
      await api.post("/api/my/shift-cover", {
        shiftAssignmentId: assignmentId,
        reason,
      });
      toast.success("Cover request submitted");
      setCoveringId(null);
      setReason("");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to submit cover request"));
    } finally {
      setSubmitting(false);
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
        title="My Roster"
        subtitle="Your upcoming shift assignments"
      />

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="overflow-x-auto">
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
                <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {(assignments ?? []).map((a) => (
                <>
                  <tr
                    key={a.id}
                    className="border-b border-gray-100 last:border-0 even:bg-gray-50"
                  >
                    <td className="px-4 py-3">{formatDate(a.date)}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {a.locationName}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{a.jobRoleName}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatTime(a.startTime)} – {formatTime(a.endTime)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {coveringId === a.id ? (
                        <button
                          onClick={() => {
                            setCoveringId(null);
                            setReason("");
                          }}
                          className="text-xs text-gray-500 hover:text-black transition"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => setCoveringId(a.id)}
                          className="text-xs text-blue-500 hover:text-blue-700 transition"
                        >
                          Request Cover
                        </button>
                      )}
                    </td>
                  </tr>
                  {coveringId === a.id && (
                    <tr
                      key={`cover-${a.id}`}
                      className="bg-blue-50 border-b border-gray-100"
                    >
                      <td colSpan={5} className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            placeholder="Reason for cover request..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                          />
                          <button
                            disabled={!reason.trim() || submitting}
                            onClick={() => handleRequestCover(a.id)}
                            className="bg-black text-white text-sm px-4 py-1.5 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
                          >
                            {submitting ? "Submitting..." : "Submit"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {(assignments ?? []).length === 0 && (
                <EmptyState colSpan={5} message="No shifts assigned yet" />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
