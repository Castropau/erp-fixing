import React from "react";

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  name: string;
  color: string; // New prop for dynamic card color
  border: string;
}

export default function Card(props: CardProps) {
  const { title, icon, name, color, border } = props;

  return (
    <div
      className={`bg-${color} p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out transform hover:scale-102 dark:bg-gray-700 border border-${border} `}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-700 dark:text-white">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {icon && (
          <div
            className={`bg-${color}-100 p-3 rounded-full text-${color}-500 dark:text-white`}
          >
            <p className="text-3xl">{icon}</p>
          </div>
        )}
        <p className="text-lg font-bold text-gray-800 dark:text-white">
          {name}
        </p>
      </div>
    </div>
  );
}
