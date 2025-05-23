/** server actions */
import { getCookies } from "@/server/getToken";

/** interfaces */
import { Role } from "@/interfaces/Role";



export interface Item {
    id: number;
    item_no: string;
    item: string,
    description: string,
    brand: string,
    model: string,
    quantity: number,
    unit_of_measurement: string,
    srp: number,
    
}

export async function FetchItemInventory(): Promise<Item[]> {
    const token = await getCookies("token");
    const response = await fetch(
      "http://192.168.0.249:8001/api/v1/items/",
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