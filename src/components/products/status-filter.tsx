"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "";

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newStatus) {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }
    
    // Preserve the search query if it exists
    const q = searchParams.get("q");
    if (q) {
      params.set("q", q);
    }
    
    router.push(`/admin/products?${params.toString()}`);
  };

  return (
    <select
      name="status"
      value={statusFilter}
      onChange={handleStatusChange}
      className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <option value="">All Statuses</option>
      <option value="available">Available</option>
      <option value="reserved">Reserved</option>
      <option value="sold">Sold</option>
    </select>
  );
}
