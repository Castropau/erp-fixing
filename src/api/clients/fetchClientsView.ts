
import { getCookies } from "@/server/getToken";
interface Quotations{
    id: number,
    quotation_no: string,
    project_name: string,

}

export interface FetchClientId {
    id: number | string,
    
   created_by: string,
   date_created: string,

   quotations: Quotations[],
   client: string,
   address: string,
   contact_person: string,
   position: string,
   contact_number: string,
   email: string,
   

}

export async function fetchClientDataById(id: number): Promise<FetchClientId> {
  const token = await getCookies("token");
  const response = await fetch(
    `http://192.168.0.249:8001/api/v1/clients/${id}/`,
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







