import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded-full transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
