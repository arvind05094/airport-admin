interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className={`${action ? "flex items-center justify-between" : ""} mb-6`}>
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
