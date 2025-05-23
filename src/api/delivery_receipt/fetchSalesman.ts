import { getCookies } from "@/server/getToken";


interface Salesman{
     id: number,
    username: string,
    full_name: string,
    role: string,
    department: string,
    contact_number: string,
}


export async function fetchSalesmanBy(): Promise<Salesman[]> {
  const token = await getCookies("token");
  const response = await fetch(
    `http://192.168.0.249:8001/api/v1/users/sales/`,
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
