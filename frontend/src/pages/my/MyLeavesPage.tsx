import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api";
import { MyLeave } from "../../types/my";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";

interface ApplyForm {
  startDate: string;
  endDate: string;
  reason: string;
}

export default function MyLeavesPage() {
  const [leaves, setLeaves] = useState<MyLeave[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ApplyForm>({ startDate: "", endDate: "", reason: "" });
  const [loading, setLoading] = useState(true);

  const fetchLeaves = () => {
    api.get("/api/my/leaves").then((res) => {
      setLeaves(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/my/leaves/apply", form);
      toast.success("Leave request submitted");
      setShowForm(false);
      setForm({ startDate: "", endDate: "", reason: "" });
      fetchLeaves();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Failed to submit leave request");
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm("Cancel this leave request?")) return;
    try {
      await api.delete(`/api/my/leaves/${id}`);
      toast.success("Leave request cancelled");
      fetchLeaves();
    } catch {
      toast.error("Failed to cancel leave request");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="My Leaves"
        subtitle="View and manage your leave requests"
        action={{ label: showForm ? "Cancel" : "Apply for Leave", onClick: () => setShowForm(!showForm) }}
      />

      {showForm && (
        <form
          onSubmit={handleApply}
          className="border border-gray-200 rounded-lg p-6 mb-6 bg-white grid grid-cols-2 gap-4"
        >
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
          <div className="col-span-2">
            <label className="text-sm font-medium block mb-1">Reason</label>
            <textarea
              required
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              rows={3}
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
              <th className="text-left px-4 py-3 font-medium text-gray-600">Start Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">End Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Reason</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3">{leave.startDate}</td>
                <td className="px-4 py-3">{leave.endDate}</td>
                <td className="px-4 py-3 text-gray-500">{leave.reason}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={leave.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  {leave.status === "Pending" && (
                    <button
                      onClick={() => handleCancel(leave.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {leaves.length === 0 && (
              <EmptyState colSpan={5} message="No leave requests found" />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
