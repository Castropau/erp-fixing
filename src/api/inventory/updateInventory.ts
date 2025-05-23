
import { getCookies } from "@/server/getToken";


export interface UpdateInventory {
    id: number,
    
   photos: string,
   item: string,
   brand: string,
   serial: string,
   model: string,
   specification: string,
   unit_of_measurement: string,
   srp: number,
   quantity: number,
   description: string,
   item_reference: string,
   location: string,
   category: string,
   

}

export async function updateInventory(id: number, viewData: UpdateInventory ): Promise<UpdateInventory> {
  const token = await getCookies("token");
  const response = await fetch(`http://192.168.0.249:8001/api/v1/inventories/${id}/`, {
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




