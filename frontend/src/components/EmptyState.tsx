export default function EmptyState({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-8 text-center text-gray-400 text-sm">
        {message}
      </td>
    </tr>
  );
}
