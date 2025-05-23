/** server actions */
import { getCookies } from "@/server/getToken";

/** interfaces */
import { Role } from "@/interfaces/Role";



export interface Categories {
    id: number;
    category: string;
}

export async function fetchCategory(): Promise<Categories[]> {
    const token = await getCookies("token");
    const response = await fetch(
      "http://192.168.0.249:8001/api/v1/items/categories",
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