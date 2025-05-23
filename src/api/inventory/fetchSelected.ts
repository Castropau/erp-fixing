import { getCookies } from "@/server/getToken";

export interface ItemDetails {
  
  id: string;
  item_name: string;
  description: string;
  brand: string;
  model: string;
  quantity: number;
  unit_of_measurement: string;
  srp: number;
}

export async function FetchItemDetails(id: string): Promise<ItemDetails> {
  const token = await getCookies("token");
  const response = await fetch(
    `http://192.168.0.249:8001/api/v1/items/${id}`,  // Assuming your endpoint takes id as a parameter
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
