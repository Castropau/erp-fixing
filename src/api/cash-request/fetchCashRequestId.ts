/** server actions */
import { getCookies } from "@/server/getToken";

 interface NotedBy {
  id: number; 
  username: string; 
  full_name: string; 
  role: string; 
  department: string;
  contact_number: string; 
}

// date_noted 

interface Approved_by{
   id: number; 
  username: string; 
  full_name: string; 
  role: string; 
  department: string;
  contact_number: string; 
}

// requested by

interface RequestedBy{
  id: number; 
  username: string; 
  full_name: string; 
  role: string; 
  department: string;
  contact_number: string; 
}

// date_requested
// created_by
// date_created
// date_cancelled


interface CancelledBy{
  id: number; 
  username: string; 
  full_name: string; 
  role: string; 
  department: string;
  contact_number: string; 
}


interface CashRequisitionItem{
    id: number;
    total_price: string;
    item: string;
    supplier: string;
    unit_of_measurement: string;
    quantity: number;
    unit_price: number;
    description: string;
    
}

interface UserListApproved {
    id: number;
    username: string;
    full_name: string;
    role: string;
    department: string;
    contact_number: string;

}

// export interface RequisitionCashId {
//   id: number; 
//   cheque_request_ref: string; 
//   serial_no: string; 
//   special_instructions: string; 
//   grand_total: string; 
//   requested_by: RequestedBy; 
//   date_requested: string; 
//   created_by: string; 
//   date_created: string; 
//   date_cancelled: string; 
//   cancelled_by: CancelledBy; 
//   cash_requisition_items: UserListApproved[]; 
//   sub_total: string; 
//   total: string; 
//   vat_value: string; 
//   ewt_value: string; 
//   status: string; 
//   project_name: string; 
//   delivery_address: string; 
//   discount: number; 
//   vat_percentage: number; 
//   less_ewt: number; 
//   date_noted: string; 
//   approved_by: Approved_by; 
//   date_approved: string;
 
// }


export interface RequisitionCashId{
  id: number; 
  noted_by: NotedBy;
  date_noted: string | null;
  approved_by: Approved_by;
  date_approved: string | null;
  requested_by: RequestedBy;
  date_requested: string | null;
  created_by: string;
  date_created: string; 
  date_cancelled: string;
  cancelled_by: CancelledBy;
  cash_requisition_items: CashRequisitionItem;

  cheque_request_ref: string; 
  serial_no: string; 
  sub_total: string; 
  total: string; 
  vat_value: string; 
  ewt_value: string;
  grand_total: string; 
  special_instructions: string; 
  project_name: string; 
  delivery_address: string;
  status: string; 
  discount: number; 
  vat_percentage: number; 
  less_ewt: number; 
//   requested_by: RequestedBy; 
//   date_requested: string; 
//   created_by: string; 
//   date_created: string; 
//   date_cancelled: string; 
//   cancelled_by: CancelledBy; 
//   cash_requisition_items: UserListApproved[]; 
//   date_approved: string;
}


// export async function fetchCashRequestId(id: number): Promise<RequisitionCashId[]> {
//   const token = await getCookies("token");
//   const response = await fetch(`http://192.168.0.249:8001/api/v1/requisitions/cash/${id}/`, {
//     method: "PUT", 
//     headers: {
//       Authorization: `Bearer ${token?.value}`,
//       "Content-Type": "application/json", 
//     },
//     // body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }

//   // Return the response as JSON
//   return response.json();
// }


export async function fetchCashRequestId(id: number): Promise<RequisitionCashId> {
  const token = await getCookies("token");
  const response = await fetch(
    `http://192.168.0.112:8000/api/v1/requisitions/cash/${id}/`,
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

