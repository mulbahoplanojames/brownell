import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockPuppies } from "@/lib/mock-data";
import Link from "next/link";
import { StatusFilter } from "@/components/products/status-filter";

type SearchParams = {
  q?: string;
  status?: string;
};

export default function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const q = (searchParams?.q || "").toLowerCase();
  const statusFilter = searchParams?.status;

  // Filter puppies based on search query and status
  const filteredPuppies = mockPuppies.filter((puppy) => {
    const matchesSearch =
      !q ||
      puppy.name.toLowerCase().includes(q) ||
      puppy.breed.toLowerCase().includes(q) ||
      puppy.breeder.businessName.toLowerCase().includes(q);

    const matchesStatus = !statusFilter || puppy.availability === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      available: "bg-green-100 text-green-800",
      reserved: "bg-yellow-100 text-yellow-800",
      sold: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge
        className={`${
          statusMap[status as keyof typeof statusMap] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3">
        <h1 className="text-3xl font-semibold">Products</h1>
        <span className="text-sm text-muted-foreground">
          {filteredPuppies.length} product
          {filteredPuppies.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <form
          className="flex-1 flex gap-2"
          action="/admin/products"
          method="get"
        >
          <Input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by name, breed, or breeder"
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>

        <StatusFilter />
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b text-left">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Breed</th>
              <th className="px-4 py-3 font-medium">Breeder</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
              <th className="px-4 py-3 font-medium">Age</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPuppies.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-center text-muted-foreground"
                  colSpan={6}
                >
                  No products found.
                </td>
              </tr>
            ) : (
              filteredPuppies.map((puppy) => (
                <tr key={puppy.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">
                    <Link href="#" className="text-blue-600 hover:underline">
                      {puppy.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{puppy.breed}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {puppy.breeder.businessName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {puppy.location}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    ${puppy.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {Math.floor(puppy.age / 4.345)} months
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(puppy.availability)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
