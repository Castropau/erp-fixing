import { getCookies } from "@/server/getToken";

export interface Location{
    id: number,
}
export async function deleteLocation(id: number): Promise<void> {
  const token = await getCookies("token");
  const response = await fetch(
    `http://192.168.0.249:8001/api/v1/inventories/location/${id}/`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete the item");
  }
}




