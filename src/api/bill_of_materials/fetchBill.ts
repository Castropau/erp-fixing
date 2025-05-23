/** server actions */
import { getCookies } from "@/server/getToken";

export interface Boms {
  bom_no: string; // full_name as a string
  project_name: string; // department as a string
  role: string;
  is_active: boolean;
  is_superuser: boolean;
  client: string;
  date_created: string;
  created_by: string;
  status: boolean;
  date: string;
  id: number;
}

export async function fetchBomList(): Promise<Boms[]> {
  const token = await getCookies("token");
  const response = await fetch("http://192.168.0.249:8001/api/v1/boms/", {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}



