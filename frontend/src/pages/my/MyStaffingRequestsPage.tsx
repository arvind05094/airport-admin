import { useState } from "react";
import { toast } from "sonner";
import api, { formatDate, getErrorMessage } from "../../lib/api";
import { useFetch } from "../../hooks/useFetch";
import type { MyStaffingRequest } from "../../types/my";
import type { Location, JobRole } from "../../types/common";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import BulkRequestForm, { type BulkRow } from "@/components/BulkRequestForm";
interface CreateForm {
  locationId: number;
  jobRoleId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  requiredCount: number;
}

const emptyForm: CreateForm = {
  locationId: 0,
  jobRoleId: 0,
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  requiredCount: 1,
};

type FormMode = "none" | "single" | "bulk";

export default function MyStaffingRequestsPage() {
  const {
    data: requests,
    loading,
    error,
    refetch,
  } = useFetch<MyStaffingRequest[]>("/api/my/staffing-requests");
  const { data: locations } = useFetch<Location[]>("/api/admin/locations");
  const { data: jobRoles } = useFetch<JobRole[]>("/api/admin/job-roles");
  const [mode, setMode] = useState<FormMode>("none");
  const [form, setForm] = useState<CreateForm>(emptyForm);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/my/staffing-requests", form);
      toast.success("Staffing request created");
      setMode("none");
      setForm(emptyForm);
      refetch();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to create request"));
    }
  };

  const handleBulkSubmit = async (rows: BulkRow[]) => {
    try {
      await api.post("/api/my/staffing-requests/bulk", { requests: rows });
      toast.success("Bulk staffing requests created");
      setMode("none");
      refetch();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to create bulk requests"));
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm("Cancel this request?")) return;
    try {
      await api.delete(`/api/my/staffing-requests/${id}`);
      toast.success("Request cancelled");
      refetch();
    } catch {
      toast.error("Failed to cancel request");
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
        title="My Staffing Requests"
        subtitle="Create and manage staffing requests"
        action={
          mode === "none"
            ? undefined
            : { label: "Close", onClick: () => setMode("none") }
        }
      />

      {mode === "none" && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("single")}
            className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition"
          >
            New Request
          </button>
          <button
            onClick={() => setMode("bulk")}
            className="border border-gray-300 text-sm px-4 py-2 rounded-md hover:bg-gray-50 transition"
          >
            Bulk Request
          </button>
        </div>
      )}

      {mode === "single" && (
        <form
          onSubmit={handleCreate}
          className="border border-gray-200 rounded-lg p-6 mb-6 bg-white grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="text-sm font-medium block mb-1">Location</label>
            <select
              required
              value={form.locationId}
              onChange={(e) =>
                setForm({ ...form, locationId: +e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value={0}>Select location</option>
              {(locations ?? []).map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Job Role</label>
            <select
              required
              value={form.jobRoleId}
              onChange={(e) => setForm({ ...form, jobRoleId: +e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value={0}>Select job role</option>
              {(jobRoles ?? []).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Start Date</label>
            <input
              required
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">End Date</label>
            <input
              required
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Required Staff
            </label>
            <input
              required
              type="number"
              min={1}
              value={form.requiredCount}
              onChange={(e) =>
                setForm({ ...form, requiredCount: +e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Start Time</label>
            <input
              required
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">End Time</label>
            <input
              required
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="col-span-2 flex gap-3">
            <button
              type="submit"
              className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Submit Request
            </button>
            <button
              type="button"
              onClick={() => setMode("none")}
              className="text-sm text-gray-500 hover:text-black transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {mode === "bulk" && (
        <BulkRequestForm
          locations={locations ?? []}
          jobRoles={jobRoles ?? []}
          onSubmit={handleBulkSubmit}
          onCancel={() => setMode("none")}
        />
      )}

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
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
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {(requests ?? []).map((req) => (
                <tr
                  key={req.id}
                  className="border-b border-gray-100 last:border-0 even:bg-gray-50"
                >
                  <td className="px-4 py-3">{req.locationName}</td>
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
                  <td className="px-4 py-3 text-right">
                    {req.status === "Pending" && (
                      <button
                        onClick={() => handleCancel(req.id)}
                        className="text-xs text-red-500 hover:text-red-700 border border-red-300 rounded px-2 py-1 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(req.createdAt)}
                  </td>
                </tr>
              ))}
              {(requests ?? []).length === 0 && (
                <EmptyState colSpan={8} message="No staffing requests found" />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
