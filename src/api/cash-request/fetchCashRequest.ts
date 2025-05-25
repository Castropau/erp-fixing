/** server actions */
import { getCookies } from "@/server/getToken";

export interface RequisitionCash {
  id: number; // id as an integer
  serial_no: string;
  special_instructions: string;
  grand_total: string;
  requested_by: string;
  date_requested: string;
  status: string;
}

export async function fetchCashRequest(): Promise<RequisitionCash[]> {
  const token = await getCookies("token");
  const response = await fetch("http://192.168.0.112:8000/api/v1/requisitions/cash/", {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}



