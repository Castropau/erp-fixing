/** server actions */
import { getCookies } from "@/server/getToken";

interface Users {
  id: number; // id as an integer
  full_name: string; // full_name as a string
  department: string; // department as a string
  role: string;
  is_active: boolean;
  is_superuser: boolean;
}

export async function fetchUserLists(): Promise<Users[]> {
  const token = await getCookies("token");
  const response = await fetch("http://192.168.0.112:8000/api/v1/users/", {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}



