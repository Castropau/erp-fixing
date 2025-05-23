import { User } from "@/interfaces/User";
import { getCookies } from "@/server/getToken";

export interface DeleteQuo {
   id: number,
   
}

export async function deleteVendor(id: number): Promise<void> {
  const token = await getCookies("token");

  const response = await fetch(`http://192.168.0.249:8001/api/v1/vendors/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete.");
  }
}




