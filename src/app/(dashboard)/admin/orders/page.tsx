import React from "react";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Prisma } from "../../../../../generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { StatusFilter } from "@/components/orders/status-filter";
import Link from "next/link";

type SearchParams = {
  q?: string;
  status?: string;
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const q = (searchParams?.q || "").trim();
  const statusFilter = searchParams?.status;

  const where: Prisma.OrderWhereInput = {};

  if (q) {
    where.OR = [
      { orderNumber: { contains: q, mode: "insensitive" as const } },
      { email: { contains: q, mode: "insensitive" as const } },
      { firstName: { contains: q, mode: "insensitive" as const } },
      { lastName: { contains: q, mode: "insensitive" as const } },
    ];
  }

  if (statusFilter) {
    where.status = statusFilter as any;
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PROCESSING: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      REFUNDED: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge
        className={`${
          statusMap[status as keyof typeof statusMap] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
      REFUNDED: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge
        className={`${
          statusMap[status as keyof typeof statusMap] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3">
        <h1 className="text-3xl font-semibold">Orders</h1>
        <span className="text-sm text-muted-foreground">
          {orders.length} order{orders.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <form className="flex-1 flex gap-2" action="/admin/orders" method="get">
          <Input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by order #, name, or email"
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
              <th className="px-4 py-3 font-medium">Order #</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium text-right">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Payment</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-center text-muted-foreground"
                  colSpan={7}
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">
                    <Link href="#" className="text-blue-600 hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {order.firstName} {order.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    items
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                  <td className="px-4 py-3">
                    {getPaymentStatusBadge(order.paymentStatus)}
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
