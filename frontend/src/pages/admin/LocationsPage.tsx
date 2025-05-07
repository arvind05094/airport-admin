import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api";

interface Location {
  id: number;
  name: string;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLocations = () => {
    api.get("/api/admin/locations").then((res) => {
      setLocations(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/locations", { name });
      toast.success("Location created");
      setShowForm(false);
      setName("");
      fetchLocations();
    } catch {
      toast.error("Failed to create location");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this location?")) return;
    try {
      await api.delete(`/api/admin/locations/${id}`);
      toast.success("Location deleted");
      fetchLocations();
    } catch {
      toast.error("Failed to delete location");
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Locations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage airport locations</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          {showForm ? "Cancel" : "Add Location"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border border-gray-200 rounded-lg p-6 mb-6 bg-white flex gap-4"
        >
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Location name"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button
            type="submit"
            className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Create
          </button>
        </form>
      )}

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr
                key={loc.id}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-4 py-3">{loc.name}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(loc.id)}
                    className="text-xs text-red-500 hover:text-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {locations.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center text-gray-400 text-sm"
                >
                  No locations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
