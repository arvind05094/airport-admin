import LoadingSpinner from "@/components/LoadingSpinner";
import PageHeader from "@/components/PageHeader";
import api, { formatDate, formatTime, getErrorMessage } from "@/lib/api";
import type { GenerateResult, RosterAssignment } from "@/types/admin";
import type { JobRole, Location } from "@/types/common";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";

interface GenerateForm {
  startDate: string;
  endDate: string;
  locationId: number | null;
  jobRoleId: number | null;
}

export default function RosterPage() {
  const [assignments, setAssignments] = useState<RosterAssignment[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [form, setForm] = useState<GenerateForm>({
    startDate: "",
    endDate: "",
    locationId: null,
    jobRoleId: null,
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchAssignments = () => {
    api.get("/api/admin/roster").then((res) => {
      setAssignments(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAssignments();
    api.get("/api/admin/locations").then((res) => setLocations(res.data));
    api.get("/api/admin/job-roles").then((res) => setJobRoles(res.data));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await api.post("/api/admin/roster/generate", form);
      setResult(res.data);
      toast.success(`Generated ${res.data.totalAssignments} assignments`);
      fetchAssignments();
      setShowForm(false);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to generate roster"));
    } finally {
      setGenerating(false);
    }
  };
  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Remove this assignment? The staffing request will be reopened and can be re-rostered.",
      )
    )
      return;
    try {
      await api.delete(`/api/admin/roster/${id}`);
      toast.success("Assignment removed and staffing request reopened");
      fetchAssignments();
    } catch {
      toast.error("Failed to remove assignment");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Roster"
        subtitle="Generate and manage shift assignments"
        action={{
          label: showForm ? "Cancel" : "Generate Roster",
          onClick: () => setShowForm(!showForm),
        }}
      />

      <div className="flex gap-3 items-end mb-6">
        <div>
          <label className="text-sm font-medium block mb-1">From</label>
          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">To</label>
          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <button
          onClick={() => {
            setFilterFrom("");
            setFilterTo("");
          }}
          className="text-sm text-gray-500 hover:text-black transition pb-2"
        >
          Clear
        </button>
      </div>
      {showForm && (
        <form
          onSubmit={handleGenerate}
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
          <div>
            <label className="text-sm font-medium block mb-1">
              Location (optional)
            </label>
            <select
              value={form.locationId ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  locationId: e.target.value ? +e.target.value : null,
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">All locations</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Job Role (optional)
            </label>
            <select
              value={form.jobRoleId ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  jobRoleId: e.target.value ? +e.target.value : null,
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">All roles</option>
              {jobRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              disabled={generating}
              className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
      )}

      {result && (
        <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-white flex gap-8 text-sm">
          <div>
            <span className="text-gray-500">Total Assignments:</span>{" "}
            <span className="font-semibold">{result.totalAssignments}</span>
          </div>
          <div>
            <span className="text-gray-500">Unfilled Requests:</span>{" "}
            <span className="font-semibold text-red-500">
              {result.unfilledRequests}
            </span>
          </div>
        </div>
      )}

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Staff
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
              <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {assignments
              .filter((a) => {
                if (filterFrom && a.date < filterFrom) return false;
                if (filterTo && a.date > filterTo) return false;
                return true;
              })
              .map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-gray-100 last:border-0 even:bg-gray-50"
                >
                  <td className="px-4 py-3">{a.userFullName}</td>
                  <td className="px-4 py-3 text-gray-500">{a.locationName}</td>
                  <td className="px-4 py-3 text-gray-500">{a.jobRoleName}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(a.date)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatTime(a.startTime)} - {formatTime(a.endTime)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            {assignments.length === 0 && (
              <EmptyState colSpan={6} message="No assignments yet" />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
