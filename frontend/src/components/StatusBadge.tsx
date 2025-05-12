const statusStyles: Record<string, string> = {
  Approved: "border-green-300 text-green-700",
  Fulfilled: "border-green-300 text-green-700",
  Rejected: "border-red-300 text-red-700",
  Cancelled: "border-red-300 text-red-700",
};

const defaultStyle = "border-gray-300 text-gray-600";

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs border ${statusStyles[status] ?? defaultStyle}`}
    >
      {status}
    </span>
  );
}
