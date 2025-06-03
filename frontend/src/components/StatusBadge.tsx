const statusStyles: Record<string, string> = {
  Approved: "bg-green-100 text-green-700",
  Fulfilled: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Cancelled: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
  "Partially Filled": "bg-orange-100 text-orange-700",
};

const defaultStyle = "bg-gray-100 text-gray-600";

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${statusStyles[status] ?? defaultStyle}`}
    >
      {status}
    </span>
  );
}
