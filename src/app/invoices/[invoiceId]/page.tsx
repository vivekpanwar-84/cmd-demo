import { InvoiceDetail } from "@/components/invoice-detail";

interface PageProps {
    params: Promise<{ invoiceId: string }>;
    searchParams: Promise<{ customerId?: string; orgId?: string }>;
}

export default async function InvoiceDetailPage({ params, searchParams }: PageProps) {
    const { invoiceId } = await params;
    const { customerId, orgId } = await searchParams;
    return <InvoiceDetail invoiceId={invoiceId} customerId={customerId} orgId={orgId ?? ""} />;
}
