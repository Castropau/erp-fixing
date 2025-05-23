/** server actions */
import { getCookies } from "@/server/getToken";

export interface EicUser {
  id: number; // id as an integer
  full_name: string;
}

export async function fetchEicUser(): Promise<EicUser[]> {
  const token = await getCookies("token");
  const response = await fetch("http://192.168.0.249:8001/api/v1/users/display/engineers/", {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}
