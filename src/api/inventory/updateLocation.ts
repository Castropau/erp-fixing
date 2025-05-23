
import { getCookies } from "@/server/getToken";


export interface UpdateInventory {
    id: number,
    
location: string,
   

}

export async function updateLocation(id: number, viewData: UpdateInventory ): Promise<UpdateInventory> {
  const token = await getCookies("token");
  const response = await fetch(`http://192.168.0.249:8001/api/v1/inventories/location/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token?.value}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(viewData),
  });
  if (!response.ok) {
    throw new Error("Network response was not okkk");
  }
  return response.json();
}




