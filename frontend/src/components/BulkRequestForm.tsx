import type { Location, JobRole } from "@/types/common";
import { useState } from "react";

export interface BulkRow {
  locationId: number;
  jobRoleId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  requiredCount: number;
}

const emptyRow = (): BulkRow => ({
  locationId: 0,
  jobRoleId: 0,
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  requiredCount: 1,
});

interface Props {
  locations: Location[];
  jobRoles: JobRole[];
  onSubmit: (rows: BulkRow[]) => Promise<void>;
  onCancel: () => void;
}

const inputCls =
  "w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-black";

export default function BulkRequestForm({
  locations,
  jobRoles,
  onSubmit,
  onCancel,
}: Props) {
  const [rows, setRows] = useState<BulkRow[]>([emptyRow()]);
  const [submitting, setSubmitting] = useState(false);

  const update = (
    index: number,
    field: keyof BulkRow,
    value: string | number,
  ) =>
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    );

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (index: number) =>
    setRows((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(rows);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-200 rounded-lg p-6 mb-6 bg-white"
    >
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left pb-2 pr-2 font-medium text-gray-600">
                Location
              </th>
              <th className="text-left pb-2 pr-2 font-medium text-gray-600">
                Job Role
              </th>
              <th className="text-left pb-2 pr-2 font-medium text-gray-600">
                Start Date
              </th>
              <th className="text-left pb-2 pr-2 font-medium text-gray-600">
                End Date
              </th>
              <th className="text-left pb-2 pr-2 font-medium text-gray-600">
                Start Time
              </th>
              <th className="text-left pb-2 pr-2 font-medium text-gray-600">
                End Time
              </th>
              <th className="text-left pb-2 pr-2 font-medium text-gray-600">
                Count
              </th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                <td className="py-2 pr-2">
                  <select
                    required
                    value={row.locationId}
                    onChange={(e) => update(i, "locationId", +e.target.value)}
                    className={inputCls}
                  >
                    <option value={0}>Select</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 pr-2">
                  <select
                    required
                    value={row.jobRoleId}
                    onChange={(e) => update(i, "jobRoleId", +e.target.value)}
                    className={inputCls}
                  >
                    <option value={0}>Select</option>
                    {jobRoles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 pr-2">
                  <input
                    required
                    type="date"
                    value={row.startDate}
                    onChange={(e) => update(i, "startDate", e.target.value)}
                    className={inputCls}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    required
                    type="date"
                    value={row.endDate}
                    onChange={(e) => update(i, "endDate", e.target.value)}
                    className={inputCls}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    required
                    type="time"
                    value={row.startTime}
                    onChange={(e) => update(i, "startTime", e.target.value)}
                    className={inputCls}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    required
                    type="time"
                    value={row.endTime}
                    onChange={(e) => update(i, "endTime", e.target.value)}
                    className={inputCls}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    required
                    type="number"
                    min={1}
                    value={row.requiredCount}
                    onChange={(e) =>
                      update(i, "requiredCount", +e.target.value)
                    }
                    className={`${inputCls} w-16`}
                  />
                </td>
                <td className="py-2">
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {rows.map((row, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Row {i + 1}
              </span>
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Location
                </label>
                <select
                  required
                  value={row.locationId}
                  onChange={(e) => update(i, "locationId", +e.target.value)}
                  className={inputCls}
                >
                  <option value={0}>Select</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Job Role
                </label>
                <select
                  required
                  value={row.jobRoleId}
                  onChange={(e) => update(i, "jobRoleId", +e.target.value)}
                  className={inputCls}
                >
                  <option value={0}>Select</option>
                  {jobRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    Start Date
                  </label>
                  <input
                    required
                    type="date"
                    value={row.startDate}
                    onChange={(e) => update(i, "startDate", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    End Date
                  </label>
                  <input
                    required
                    type="date"
                    value={row.endDate}
                    onChange={(e) => update(i, "endDate", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    Start Time
                  </label>
                  <input
                    required
                    type="time"
                    value={row.startTime}
                    onChange={(e) => update(i, "startTime", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    End Time
                  </label>
                  <input
                    required
                    type="time"
                    value={row.endTime}
                    onChange={(e) => update(i, "endTime", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Required Count
                </label>
                <input
                  required
                  type="number"
                  min={1}
                  value={row.requiredCount}
                  onChange={(e) => update(i, "requiredCount", +e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button
          type="button"
          onClick={addRow}
          className="text-sm text-gray-600 hover:text-black border border-gray-300 rounded-md px-3 py-1.5 transition"
        >
          + Add Row
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit All"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-black transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
