// src/app/erp-v2/cash-request/Invoice/[id]/page.tsx

import React from "react";
import { useRouter } from "next/navigation";
import { fetchCashRequestId } from "@/api/cash-request/fetchCashRequestId";
import OpenFile from "./OpenFile";

// Page component
const Page = async () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <div>Loading...</div>; // Handle loading state
  }

  // Fetch data from API using `id`
  const cashRequestData = await fetchCashRequestId(id as string);

  return (
    <div className="p-4">
      <OpenFile cashRequestData={cashRequestData} /> {/* Pass data as prop */}
    </div>
  );
};

export default Page;
