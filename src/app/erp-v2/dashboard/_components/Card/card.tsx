import React from "react";

interface CardProps {
  title: string; // Title to display (e.g., percentage, count, etc.)
  icon?: React.ReactNode; // Optional icon to display
  name: "Users" | "Orders" | "Sales" | "Marketing"; // Category
}

export default function DashboardCard(props: CardProps) {
  const { title, icon, name } = props;

  // Define color based on the category
  let categoryClass = "";
  let progressBarClass = "";

  switch (name) {
    case "Users":
      categoryClass = "bg-white text-black dark:text-white";
      progressBarClass = "bg-black";
      // categoryClass = "bg-blue-500 text-white";
      // progressBarClass = "bg-blue-600";
      break;
    case "Orders":
      // categoryClass = "bg-teal-500 text-white";
      // progressBarClass = "bg-teal-600";
      categoryClass = "bg-white text-black";
      progressBarClass = "bg-black";
      break;
    case "Sales":
      // categoryClass = "bg-orange-500 text-white";
      // progressBarClass = "bg-orange-600";
      categoryClass = "bg-white text-black";
      progressBarClass = "bg-black";
      break;
    case "Marketing":
      // categoryClass = "bg-purple-500 text-white";
      // progressBarClass = "bg-purple-600";
      categoryClass = "bg-white text-black";
      progressBarClass = "bg-black";
      break;
    default:
      categoryClass = "bg-gray-500 text-white";
      progressBarClass = "bg-gray-600";
  }

  return (
    <div
      className={`p-6 rounded-lg shadow-lg ${categoryClass} hover:transform hover:translate-y-2 hover:shadow-xl transition-all duration-300 dark:bg-gray-900 border border-black`}
    >
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-semibold dark:text-white">{title}</h1>
        <span className="text-sm dark:text-white">{title}%</span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        {icon && <div className="text-black dark:text-white">{icon}</div>}
        <p className="text-lg font-semibold  cursor-pointer dark:text-white">
          {name}
        </p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
        <div
          className={`h-2 rounded-full dark:bg-white ${progressBarClass}`}
          style={{ width: `${title}%` }}
        ></div>
      </div>
    </div>
  );
}
