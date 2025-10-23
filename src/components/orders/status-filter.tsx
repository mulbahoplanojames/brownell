"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "";
  const q = searchParams.get("q") || "";

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    const params = new URLSearchParams();
    
    if (q) params.set("q", q);
    if (newStatus) params.set("status", newStatus);
    
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      name="status"
      value={statusFilter}
      onChange={handleStatusChange}
      className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <option value="">All Statuses</option>
      <option value="PENDING">Pending</option>
      <option value="PROCESSING">Processing</option>
      <option value="SHIPPED">Shipped</option>
      <option value="DELIVERED">Delivered</option>
      <option value="CANCELLED">Cancelled</option>
      <option value="REFUNDED">Refunded</option>
    </select>
  );
}
