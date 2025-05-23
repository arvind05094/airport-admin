import { useEffect, useState } from "react";
import api from "../../lib/api";
import type { AdminAvailability } from "../../types/admin";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../components/PageHeader";

export default function AvailabilityPage() {
  const [records, setRecords] = useState<AdminAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/admin/availability").then((res) => {
      setRecords(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Availability"
        subtitle="Staff unavailability overview"
      />

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
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
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr
                key={r.id}
                className="border-b border-gray-100 last:border-0 even:bg-gray-50"
              >
                <td className="px-4 py-3">{r.userFullName}</td>
                <td className="px-4 py-3 text-gray-500">{r.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${r.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {r.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
