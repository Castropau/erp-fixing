"use client";

import { useQuery } from "@tanstack/react-query";

/** api */
import { fetchUserList } from "@/api/User/fetchUserList";
import { fetchRoleData } from "@/api/Roles/Roles";

/** components */
import UserList from "./_components/Table/UserList";
import DashboardCard from "./_components/Card/card";
import { FaBox, FaBullhorn, FaUsers } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import StatisticsChart from "./_components/Chart/StatisticsChart";

export default function User() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUserList,
  });

  const { data: roleList } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoleData,
  });

  if (isLoading) return <div className="text-center text-lg">Loading...</div>;

  if (error instanceof Error)
    return (
      <div className="text-center text-lg">
        An error has occurred: {error.message}
      </div>
    );

  const uniqueDepartments = new Set(data?.map((user) => user.department));
  const departmentCount = uniqueDepartments.size;

  const uniqueRoles = new Set(roleList?.map((user) => user.role));
  const roleCount = uniqueRoles.size;

  const uniqueUsers = new Set(data?.map((user) => user.id));
  const usersCount = uniqueUsers.size;

  return (
    <div className="p-4   min-h-screen dark:bg-gray-dark">
      <h1 className="text-3xl font-bold text-gray-900 mb-3 dark:text-white">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
        {/* Dashboard Cards */}
        <DashboardCard
          title={`Total of ${usersCount} Users`}
          name="Users"
          icon={
            <FaUsers
              size="2em" // Adjust the icon size
            />
          }
        />
        <DashboardCard
          title={`Total of ${departmentCount} Orders`}
          name="Orders"
          icon={
            <FaBox
              size="2em" // Adjust the icon size
            />
          }
        />

        <DashboardCard
          title={`Total of ${roleCount} Sales`}
          name="Sales"
          icon={
            <FaShoppingCart
              size="2em" // Adjusting size for better visibility
            />
          }
        />
        <DashboardCard
          title={`Total of ${roleCount} Marketing`}
          name="Marketing"
          icon={
            <FaBullhorn
              size="2em" // Adjusting size for better visibility
            />
          }
        />
      </div>
      {/* Placeholder for additional content */}
      <div className="overflow-x-auto">{/* <CreateUser /> */}</div>
      <StatisticsChart />
    </div>
  );
}
