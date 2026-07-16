import { ReactNode } from "react";

type InputProps = {
  label: string;
  type: string;
  placeholder?: string;
  icon?: ReactNode;
  onIconClick?: () => void;
};

export default function Input({
  label,
  type,
  placeholder,
  icon,
  onIconClick,
}: InputProps) {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 p-3 pr-12 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200"
        />

        {icon &&
          (onIconClick ? (
            <button
              type="button"
              onClick={onIconClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-cyan-600"
            >
              {icon}
            </button>
          ) : (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          ))}
      </div>
    </div>
  );
}