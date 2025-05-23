import { User } from "@/interfaces/User";
import { getCookies } from "@/server/getToken";

export interface DeleteLiq {
   id: number,
   
}

export async function deleteLiquidation(id: number): Promise<void> {
  const token = await getCookies("token");

  const response = await fetch(`http://192.168.0.249:8001/api/v1/liquidations/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete cash requisition.");
  }
}




