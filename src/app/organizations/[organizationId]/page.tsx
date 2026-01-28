import { OrganizationDetail } from "@/components/organization-detail";

interface PageProps {
  params: Promise<{ organizationId: string }>;
}

export default async function OrganizationDetailPage({ params }: PageProps) {
  const { organizationId } = await params;
  return <OrganizationDetail organizationId={organizationId} />;
}
