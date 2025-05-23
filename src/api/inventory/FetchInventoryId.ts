
import { getCookies } from "@/server/getToken";

interface Location{
    id: number,
  location: string,

}

interface Category{
    id: number,
    category: string,
}

interface Item{
    id: number,
    item_no: string,
}
export interface FetchInventoryId {
    id: number,
    item_reference: Item,
   description: string,
   brand: string,
   serial: string,
   model: string,
   specification: string,
   quantity: number,
   unit_of_measurement: string,
   srp: number,
   category: Category,
   location: Location,
   photos: string,
   item_no: string,

    
}

export async function fetchInventoryDataById(id: number): Promise<FetchInventoryId> {
  const token = await getCookies("token");
  const response = await fetch(
    `http://192.168.0.249:8001/api/v1/inventories/${id}/`,
    {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}







