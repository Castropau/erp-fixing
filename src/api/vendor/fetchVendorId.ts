
import { getCookies } from "@/server/getToken";

interface Items{
    id: number,
    item_no: string,
    is_active: boolean,
    brand: string,
    vendor: string,
    created_by: string,
    item: string,

}
export interface FetchVendorId {
    id: number,
   items: Items[],
   country: string,
   created_by: string,
   date_created: string,
   vendor: string,
   address: string,
   contact_person: string,
   contact_number: string,
   email: string,
   tin: string,
   bank_details: string,
   description: string,
   
  //  length: number,

    
}

export async function fetchVendorDataById(id: number): Promise<FetchVendorId> {
  const token = await getCookies("token");
  const response = await fetch(
    `http://192.168.0.249:8001/api/v1/vendors/${id}/`,
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







