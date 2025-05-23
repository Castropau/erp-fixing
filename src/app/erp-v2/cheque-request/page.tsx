"use client";

import { useQuery } from "@tanstack/react-query";

/** api */
import { fetchUserList } from "@/api/User/fetchUserList";
import { fetchRoleData } from "@/api/Roles/Roles";
export interface ChequeLists {
  special_instructions: string;
  id: number; // id as an integer
  serial_no: string; // serial number as a string
  purpose: string; // purpose of the cheque as a string
  grand_total: string;
  requested_by: string;
  date_requested: string;
  status: boolean;
}
/** components */
import ChequeRequest from "./ChequeRequest";
import { fetchChequesLists } from "@/api/cheque-request/fetchCheque";

export default function Page() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUserList,
  });

  const { data: roleList } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoleData,
  });
  const {
    data: datas,
    isLoading: loading,
    error: errors,
  } = useQuery({
    queryKey: ["cheque"],
    queryFn: fetchChequesLists,
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
    <div className=" p-4">
      <ChequeRequest />
    </div>
  );
}
