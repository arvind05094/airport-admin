import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import api, { formatDate, formatTime, getErrorMessage } from "@/lib/api";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface StaffingRequestDetail {
  id: number;
  createdByFullName: string;
  locationName: string;
  jobRoleName: string;
  date: string;
  startTime: string;
  endTime: string;
  requiredCount: number;
  assignedCount: number;
  unfilledCount: number;
  status: string;
  createdAt: string;
  assignments: {
    id: number;
    userFullName: string;
    date: string;
    startTime: string;
    endTime: string;
    locationName: string;
    jobRoleName: string;
  }[];
}

export default function StaffingRequestDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "Admin";
  const [showConfirm, setShowConfirm] = useState(false);
  const [generating, setGenerating] = useState(false);

  const {
    data: request,
    loading,
    error,
    refetch,
  } = useFetch<StaffingRequestDetail>(`/api/staffing-requests/${id}`);
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.post(`/api/admin/roster/generate/${id}`);
      toast.success("Roster generated");
      setShowConfirm(false);
      refetch();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to generate roster"));
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-center py-12 text-red-500 text-sm">{error}</div>
    );
  if (!request) return null;

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-black transition mb-4 inline-block"
        >
          ← Back
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Staffing Request</h1>
            <p className="text-sm text-gray-500 mt-1">
              Created by {request.createdByFullName}
            </p>
          </div>
          {isAdmin && request.status !== "Fulfilled" && (
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Generate Roster
            </button>
          )}
        </div>
      </div>

      {/* Request Details */}
      <div className="border border-gray-200 rounded-lg bg-white p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Location</p>
          <p className="font-medium mt-0.5">{request.locationName}</p>
        </div>
        <div>
          <p className="text-gray-500">Job Role</p>
          <p className="font-medium mt-0.5">{request.jobRoleName}</p>
        </div>
        <div>
          <p className="text-gray-500">Date</p>
          <p className="font-medium mt-0.5">{formatDate(request.date)}</p>
        </div>
        <div>
          <p className="text-gray-500">Time</p>
          <p className="font-medium mt-0.5">
            {formatTime(request.startTime)} – {formatTime(request.endTime)}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Status</p>
          <div className="mt-0.5">
            <StatusBadge status={request.status} />
          </div>
        </div>
        <div>
          <p className="text-gray-500">Created</p>
          <p className="font-medium mt-0.5">{formatDate(request.createdAt)}</p>
        </div>
      </div>

      {/* Assignment Stats */}
      <div className="border border-gray-200 rounded-lg bg-white p-6 mb-6 flex gap-8 text-sm">
        <div>
          <p className="text-gray-500">Required</p>
          <p className="text-2xl font-semibold mt-0.5">
            {request.requiredCount}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Assigned</p>
          <p className="text-2xl font-semibold mt-0.5 text-green-600">
            {request.assignedCount}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Unfilled</p>
          <p className="text-2xl font-semibold mt-0.5 text-red-500">
            {request.unfilledCount}
          </p>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-medium">Assigned Staff</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Staff
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {request.assignments.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-gray-100 last:border-0 even:bg-gray-50"
                >
                  <td className="px-4 py-3">{a.userFullName}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(a.date)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatTime(a.startTime)} – {formatTime(a.endTime)}
                  </td>
                </tr>
              ))}
              {request.assignments.length === 0 && (
                <EmptyState colSpan={3} message="No staff assigned yet" />
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Roster</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Generate roster assignments for this staffing request? Available
            staff matching the job role will be automatically assigned.
          </p>
          <DialogFooter>
            <button
              onClick={() => setShowConfirm(false)}
              className="text-sm text-gray-500 hover:text-black transition px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
            >
              {generating ? "Generating..." : "Confirm"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
