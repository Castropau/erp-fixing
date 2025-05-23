
import { getCookies } from "@/server/getToken";


export interface UpdateCategory {
    id: number,
    
category: string,
   

}

export async function updateCategory(id: number, viewData: UpdateCategory ): Promise<UpdateInventory> {
  const token = await getCookies("token");
  const response = await fetch(`http://192.168.0.249:8001/api/v1/items/categories/${id}/`, {
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




