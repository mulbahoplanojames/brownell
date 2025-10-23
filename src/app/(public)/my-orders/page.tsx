import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Define TypeScript interfaces for our data
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string | Date;
  total: number;
  items: OrderItem[];
}

export default async function MyOrdersPage() {
  try {
    // Get the current user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Redirect to login if not authenticated
    if (!session?.user?.id) {
      redirect("/login?callbackUrl=/my-orders");
    }

    // Fetch orders for the current user
    const orders = (await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })) as unknown as Order[];

    // If no orders found, show empty state
    if (!orders || orders.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-4">
              You haven't placed any orders yet.
            </p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      );
    }

    // Function to get the appropriate badge for order status
    function getStatusBadge(status: string) {
      switch (status) {
        case "PENDING":
          return <Badge variant="outline">Pending</Badge>;
        case "PROCESSING":
          return <Badge variant="secondary">Processing</Badge>;
        case "SHIPPED":
          return <Badge variant="default">Shipped</Badge>;
        case "DELIVERED":
          return (
            <Badge className="bg-green-500 hover:bg-green-600">Delivered</Badge>
          );
        case "CANCELLED":
          return <Badge variant="destructive">Cancelled</Badge>;
        case "REFUNDED":
          return <Badge variant="outline">Refunded</Badge>;
        default:
          return <Badge variant="outline">{status}</Badge>;
      }
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground">
            View your order history and track your shipments
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order.orderNumber}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Placed on{" "}
                      {format(new Date(order.createdAt), "MMMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                    <span className="font-medium">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-4 flex items-center gap-4">
                      {item.image && (
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <div className="w-full flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/my-orders/${order.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in MyOrdersPage:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Error loading orders</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't load your orders. Please try again later.
          </p>
          <Button asChild>
            <Link href="/my-orders">Try Again</Link>
          </Button>
        </div>
      </div>
    );
  }
}
