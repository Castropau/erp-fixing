"use client";

import { useQuery } from "@tanstack/react-query";

/** api */
import { fetchUserList } from "@/api/User/fetchUserList";
import { fetchRoleData } from "@/api/Roles/Roles";
import InventoryCard from "./_components/Card";
import RemarksLog from "./RemarksLog";
import SelectionList from "./SelectionList";
import { useState } from "react";

/** components */

export default function Page() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUserList,
  });

  const { data: roleList } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoleData,
  });

  const uniqueDepartments = new Set(data?.map((user) => user.department));
  const departmentCount = uniqueDepartments.size;

  const uniqueRoles = new Set(roleList?.map((user) => user.role));
  const roleCount = uniqueRoles.size;

  const uniqueUsers = new Set(data?.map((user) => user.id));
  const usersCount = uniqueUsers.size;

  // State to track which button is clicked
  const [activeView, setActiveView] = useState<
    "inventory" | "remarksLog" | "selectionList"
  >("inventory");

  // Function to handle button clicks
  const handleButtonClick = (
    view: "inventory" | "remarksLog" | "selectionList"
  ) => {
    setActiveView(view);
  };
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error instanceof Error)
    return <div>An error has occurred: {error.message}</div>;

  return (
    <div className="p-4">
      <div>
        {/* Buttons to switch between views */}
        <div className="flex gap-4 mb-4">
          <button
            className={`btn ${
              activeView === "inventory"
                ? "bg-blue-500 text-white"
                : "bg-transparent text-blue-500"
            }`}
            onClick={() => handleButtonClick("inventory")}
          >
            Inventory
          </button>
          <button
            className={`btn ${
              activeView === "remarksLog"
                ? "bg-blue-500 text-white"
                : "bg-transparent text-blue-500"
            }`}
            onClick={() => handleButtonClick("remarksLog")}
          >
            Remarks Log
          </button>
          <button
            className={`btn ${
              activeView === "selectionList"
                ? "bg-blue-500 text-white"
                : "bg-transparent text-blue-500"
            }`}
            onClick={() => handleButtonClick("selectionList")}
          >
            Selection List
          </button>
        </div>

        {/* Conditionally render content based on activeView */}
        {activeView === "inventory" && <InventoryCard />}
        {activeView === "remarksLog" && <RemarksLog />}
        {activeView === "selectionList" && <SelectionList />}
      </div>
    </div>
  );
}
