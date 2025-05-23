/** server actions */
import { getCookies } from "@/server/getToken";

export interface CountryList {
  id: string;  
  name: string; 
}

export async function fetchCountryList(): Promise<CountryList[]> {
  const token = await getCookies("token");

  if (!token?.value) {
    throw new Error("Token not found");
  }

  const response = await fetch("http://192.168.0.249:8001/api/v1/vendors/countries/", {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const countryData: Record<string, string> = await response.json();
  const countries = Object.entries(countryData).map(([id, name]) => ({
    id,      
    name,    
  }));
  return countries;
}

// const sampleData: Pick<DepartmentsList, 'department'> = {
//     department: ''
// }
