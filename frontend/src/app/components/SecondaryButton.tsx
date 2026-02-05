import React from "react";

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}

export function SecondaryButton({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 bg-white text-[var(--text-dark)] border border-[var(--border-gray)] rounded-lg 
        hover:bg-gray-50 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{ fontSize: "var(--font-size-md)" }}
    >
      {children}
    </button>
  );
}
