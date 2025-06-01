"use client";
import React from "react";

interface SidebarTooltipProps {
  content: React.ReactNode;
  position: { x: number; y: number };
  visible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const SidebarTooltip: React.FC<SidebarTooltipProps> = ({
  content,
  position,
  visible,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!visible) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="fixed z-50 bg-[#800000] text-white rounded-md shadow-lg p-2 max-w-xs"
      style={{
        top: position.y,
        left: position.x,
        transition: "opacity 0.15s ease-in-out",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        cursor: "default",
      }}
    >
      {content}
    </div>
  );
};
