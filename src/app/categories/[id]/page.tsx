'use client'
import CategoryDetail from "@/components/pages/CategoryDetail";

export default async function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <>
            <CategoryDetail  id={id} />
        </>
    );
}