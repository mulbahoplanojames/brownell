"use client";

import { notFound } from "next/navigation";
import { mockPuppies } from "@/lib/mock-data";
import { PuppyDetailClient } from "@/components/puppy-detail-client";

export default async function PuppyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const puppy = mockPuppies.find((p) => p.id === id);

  if (!puppy) {
    notFound();
  }

  return <PuppyDetailClient puppy={puppy} />;
}
