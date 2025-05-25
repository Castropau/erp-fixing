/** server actions */
import { getCookies } from "@/server/getToken";

/** interfaces */
import { Role } from "@/interfaces/Role";



export interface Supplier {
    id: number;
    vendor: string;
}

export async function Supplier(): Promise<Supplier[]> {
    const token = await getCookies("token");
    const response = await fetch(
      "http://192.168.0.112:8000/api/v1/vendors/",
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