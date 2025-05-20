import type { Location, JobRole } from "@/types/common";
import { useState } from "react";

interface BulkRow {
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
      <div className="overflow-x-auto">
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
