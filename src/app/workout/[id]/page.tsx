'use client'
import WorkoutSession from "@/components/pages/WorkoutSession";
export const dynamic = 'force-dynamic'
export default async function  WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <WorkoutSession id={id} />
  );
}
