"use client";

import AddCustomerPage from "@/components/organisationDetails/AddCustomer";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ organizationId: string }>();

  const organizationId = params.organizationId;

  if (!organizationId) {
    return null; // or a loader / error UI
  }

  return (
    <div>
      <AddCustomerPage organizationId={organizationId} />
    </div>
  );
}
