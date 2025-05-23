"use client";

import { useQuery } from "@tanstack/react-query";

/** api */
import { fetchUserList } from "@/api/User/fetchUserList";
import { fetchRoleData } from "@/api/Roles/Roles";

/** components */

import PurchacaseOrder from "./PurchacaseOrder";

export default function Page() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUserList,
  });

  const { data: roleList } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoleData,
  });

  // if (isLoading) return <div>Loading...</div>;

  if (error instanceof Error)
    return <div>An error has occurred: {error.message}</div>;

  const uniqueDepartments = new Set(data?.map((user) => user.department));
  const departmentCount = uniqueDepartments.size;

  const uniqueRoles = new Set(roleList?.map((user) => user.role));
  const roleCount = uniqueRoles.size;

  const uniqueUsers = new Set(data?.map((user) => user.id));
  const usersCount = uniqueUsers.size;

  return (
    <div className="p-4">
      <PurchacaseOrder />
    </div>
  );
}
