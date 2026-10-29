import { useState } from "react";
import { toast } from "sonner";
import api from "../../lib/api";
import { useFetch } from "../../hooks/useFetch";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import type { JobRole } from "@/types/common";

export default function JobRolesPage() {
  const {
    data: jobRoles,
    loading,
    error,
    refetch,
  } = useFetch<JobRole[]>("/api/admin/job-roles");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.post("/api/admin/job-roles", { name });
      toast.success("Job role created");
      setShowForm(false);
      setName("");
      refetch();
    } catch (err: unknown) {
      let message = "Failed to create job role";
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        message = axiosErr.response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/admin/job-roles/${id}`);
      toast.success("Job role deleted");
      refetch();
    } catch (err: unknown) {
      let message = "Failed to delete job role";
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        message = axiosErr.response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(message);
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
        title="Job Roles"
        subtitle="Manage job roles"
        action={{
          label: showForm ? "Cancel" : "Add Job Role",
          onClick: () => setShowForm(!showForm),
        }}
      />

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border border-gray-200 rounded-lg p-6 mb-6 bg-white flex gap-4"
        >
          <input
            required
            disabled={isSubmitting}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Job role name"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </form>
      )}

      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="overflow-x-auto">
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
              {(jobRoles ?? []).map((role) => (
                <tr
                  key={role.id}
                  className="border-b border-gray-100 last:border-0 even:bg-gray-50"
                >
                  <td className="px-4 py-3">{role.name}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="text-xs text-red-500 hover:text-red-700 border border-red-300 rounded px-2 py-1 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {(jobRoles ?? []).length === 0 && (
                <EmptyState colSpan={2} message="No job roles found" />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}