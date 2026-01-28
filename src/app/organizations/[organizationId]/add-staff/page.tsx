"use client";

import AddStaffPage from "@/components/organisationDetails/AddStaff";
import { useParams } from "next/navigation";
import React from "react";

function Page() {
  const { organizationId } = useParams<{ organizationId: string }>();
  return (
    <div>
      <AddStaffPage organizationId={organizationId} />
    </div>
  );
}

export default Page;
