import { CustomerProfile } from "@/components/customer-profile";

interface PageProps {
    params: Promise<{ customerId: string }>;
}

export default async function CustomerDetailPage({ params }: PageProps) {
    const { customerId } = await params;
    return <CustomerProfile customerId={customerId} />;
}
