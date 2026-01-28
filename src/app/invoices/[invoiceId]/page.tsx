import { InvoiceDetail } from "@/components/invoice-detail";

interface PageProps {
    params: Promise<{ invoiceId: string }>;
}

export default async function InvoiceDetailPage({ params }: PageProps) {
    const { invoiceId } = await params;
    return <InvoiceDetail invoiceId={invoiceId} />;
}
