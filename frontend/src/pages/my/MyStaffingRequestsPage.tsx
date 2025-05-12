import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api";
import { MyStaffingRequest } from "../../types/my";
import { Location, JobRole } from "../../types/common";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";

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

export default function MyStaffingRequestsPage() {
  const [requests, setRequests] = useState<MyStaffingRequest[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateForm>(emptyForm);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    api.get("/api/my/staffing-requests").then((res) => {
      setRequests(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRequests();
    api.get("/api/admin/locations").then((res) => setLocations(res.data));
    api.get("/api/admin/job-roles").then((res) => setJobRoles(res.data));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/my/staffing-requests", form);
      toast.success("Staffing request created");
      setShowForm(false);
      setForm(emptyForm);
      fetchRequests();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Failed to create request");
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm("Cancel this request?")) return;
    try {
      await api.delete(`/api/my/staffing-requests/${id}`);
      toast.success("Request cancelled");
      fetchRequests();
    } catch {
      toast.error("Failed to cancel request");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="My Staffing Requests"
        subtitle="Create and manage staffing requests"
        action={{ label: showForm ? "Cancel" : "New Request", onClick: () => setShowForm(!showForm) }}
      />

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border border-gray-200 rounded-lg p-6 mb-6 bg-white grid grid-cols-2 gap-4"
        >
          <div>
            <label className="text-sm font-medium block mb-1">Location</label>
            <select
              required
              value={form.locationId}
              onChange={(e) => setForm({ ...form, locationId: +e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value={0}>Select location</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
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
              {jobRoles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
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
            <label className="text-sm font-medium block mb-1">Required Staff</label>
            <input
              required
              type="number"
              min={1}
              value={form.requiredCount}
              onChange={(e) => setForm({ ...form, requiredCount: +e.target.value })}
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
          <div className="col-span-2">
            <button
              type="submit"
              className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Submit Request
            </button>
          </div>
        </form>
      )}

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
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
                <td className="px-4 py-3">{req.locationName}</td>
                <td className="px-4 py-3 text-gray-500">{req.jobRoleName}</td>
                <td className="px-4 py-3 text-gray-500">{req.date}</td>
                <td className="px-4 py-3 text-gray-500">{req.startTime} - {req.endTime}</td>
                <td className="px-4 py-3 text-gray-500">{req.requiredCount}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={req.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  {req.status === "Pending" && (
                    <button
                      onClick={() => handleCancel(req.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <EmptyState colSpan={7} message="No staffing requests found" />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
