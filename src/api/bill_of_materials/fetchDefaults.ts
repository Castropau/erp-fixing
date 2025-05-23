/** server actions */
import { getCookies } from "@/server/getToken";

interface RoughingItems{
    id: number,
    manpower: string,
    no_of_days: string,
    total: string,
    per_unit_cost: string,
    order: number,
    item: string,
    ratio: string,
    unit: string,
    quantity: number,
    labor_cost: number,
}



interface SubRoughingHeadersItem{
     id: number,
    manpower: string,
    no_of_days: string,
    total: string,
    per_unit_cost: string,
    order: number,
    item: string,
    ratio: string,
    unit: string,
    quantity: number,
    labor_cost: number,

}
interface RoughingSubHeaders{
    id: number,
    items: SubRoughingHeadersItem,
    sub_header: string,

}


interface Roughing{
    id: number,
    items: RoughingItems,
    sub_headers: RoughingSubHeaders,
    items_sub_total: string,
    sub_headers_total: string,
    total: string,
    header: string,

   
}
interface WiringInsItem{
    id: number,
     manpower: string,
    no_of_days: string,
    total: string,
    per_unit_cost: string,
    order: number,
    item: string,
    ratio: string,
    unit: string,
    quantity: number,
    labor_cost: number,
    
}
interface WiringInsHeadersItem{
     id: number,
    manpower: string,
    no_of_days: string,
    total: string,
    per_unit_cost: string,
    order: number,
    item: string,
    ratio: string,
    unit: string,
    quantity: number,
    labor_cost: number,

}
interface WiringIns{
    id: number,
    items: WiringInsItem,
    sub_headers: WiringInsHeadersItem,
    item_sub_total: string,
    sub_headers_total: string,
    header: string,



}



interface DeviceHeadersItem{
     id: number,
    items: DeviceItem,
    items_sub_total: string,
    sub_header: string,
    

}
interface DeviceItem{
    id: number,
    manpower: string,
    no_of_days: string,
    total: string,
    per_unit_cost: string,
    order: number,
    item: string,
    ratio: string,
    unit: string,
    quantity: number,
    labor_cost: number,
}
interface DeviceInstall{
    id: number,
    items: DeviceItem,
    sub_headers: DeviceHeadersItem,
    sub_headers_total: string,
    header: string,
}

interface ConfigurationItem{
    id: number,
    manpower: string,
    no_of_days: string,
    total: string,
    per_unit_cost: string,
    order: number,
    item: string,
    ratio: string,
    unit: string,
    quantity: number,
    labor_cost: number,
}
interface ConfigurationHeadersItem {
  id: number;
  items: ConfigurationItem;
  items_sub_total: string;
  sub_header: string;
}

interface ConfigurationInstall {
  id: number;
  items: ConfigurationItem;
  sub_headers: ConfigurationHeadersItem;
  sub_headers_total: string;
  header: string;
}






interface TestingInstallItem{
    id: number,
    manpower: string,
    no_of_days: string,
    total: string,
    per_unit_cost: string,
    order: number,
    item: string,
    ratio: string,
    unit: string,
    quantity: number,
    labor_cost: number,
}




interface TestingSubItem{
       id: number,
    manpower: string,
    no_of_days: string,
    total: string,
    per_unit_cost: string,
    order: number,
    item: string,
    ratio: string,
    unit: string,
    quantity: number,
    labor_cost: number,
}




interface TestingHeadersItem {
  id: number;
  items: TestingSubItem;
  items_sub_total: string;
  sub_header: string;
}

interface TestingInstall {
  id: number;
  items: TestingInstallItem;
  sub_headers: TestingHeadersItem;
  sub_headers_total: string;
  header: string;
}
interface Bom{
    id: number,
    bom_no: string,
}

export interface Roughingins{
    id: number,
      lc_no: string,
    bom: string,
    roughing_ins_total: string,
    roughing_ins: Roughing,
    wiring_ins: WiringIns,
    device_installations: DeviceInstall,
configurations: ConfigurationInstall,
testing_and_commissionings: TestingInstall,
date_created: string,
   project_name: string,
   project_duration: string,
   system: string,

}

export async function fetchDefaultsList(): Promise<Roughingins[]> {
  const token = await getCookies("token");
  const response = await fetch("http://192.168.0.249:8001/api/v1/labor_computations/defaults/", {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}
