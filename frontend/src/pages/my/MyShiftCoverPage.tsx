import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api";

interface ShiftCover {
  id: number;
  shiftDate: string;
  shiftStartTime: string;
  shiftEndTime: string;
  reason: string;
  status: string;
}

interface ApplyForm {
  shiftDate: string;
  shiftStartTime: string;
  shiftEndTime: string;
  reason: string;
}

export default function MyShiftCoverPage() {
  const [requests, setRequests] = useState<ShiftCover[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ApplyForm>({
    shiftDate: "",
    shiftStartTime: "",
    shiftEndTime: "",
    reason: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    api.get("/api/my/shift-cover").then((res) => {
      setRequests(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/my/shift-cover/apply", form);
      toast.success("Shift cover request submitted");
      setShowForm(false);
      setForm({
        shiftDate: "",
        shiftStartTime: "",
        shiftEndTime: "",
        reason: "",
      });
      fetchRequests();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Failed to submit request");
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm("Cancel this request?")) return;
    try {
      await api.delete(`/api/my/shift-cover/${id}`);
      toast.success("Request cancelled");
      fetchRequests();
    } catch {
      toast.error("Failed to cancel request");
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">My Shift Cover</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage your shift cover requests
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          {showForm ? "Cancel" : "Request Cover"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleApply}
          className="border border-gray-200 rounded-lg p-6 mb-6 bg-white grid grid-cols-2 gap-4"
        >
          <div>
            <label className="text-sm font-medium block mb-1">Shift Date</label>
            <input
              required
              type="date"
              value={form.shiftDate}
              onChange={(e) => setForm({ ...form, shiftDate: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Start Time</label>
            <input
              required
              type="time"
              value={form.shiftStartTime}
              onChange={(e) =>
                setForm({ ...form, shiftStartTime: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">End Time</label>
            <input
              required
              type="time"
              value={form.shiftEndTime}
              onChange={(e) =>
                setForm({ ...form, shiftEndTime: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Reason</label>
            <input
              required
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
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
              <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req.id}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-4 py-3">{req.shiftDate}</td>
                <td className="px-4 py-3 text-gray-500">
                  {req.shiftStartTime} - {req.shiftEndTime}
                </td>
                <td className="px-4 py-3 text-gray-500">{req.reason}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs border ${
                      req.status === "Approved"
                        ? "border-green-300 text-green-700"
                        : req.status === "Rejected"
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
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-400 text-sm"
                >
                  No shift cover requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
