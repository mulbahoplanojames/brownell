import {
  CreditCard,
  Package,
  Users,
  DollarSign,
  Activity,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import StatCard from "@/components/dashboard/stat-card";
import { prisma } from "@/lib/prisma";
import { mockPuppies } from "@/lib/mock-data";

async function getDashboardData() {
  try {
    // Get recent orders with user information
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    // Get total users count
    const totalUsers = await prisma.user.count();

    // Get orders statistics
    const ordersStats = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      _count: true,
    });

    // Get products from mock data
    const products = mockPuppies.slice(0, 3); // Get first 3 products for top products

    return {
      stats: {
        totalRevenue: ordersStats._sum.total || 0,
        totalOrders: ordersStats._count || 0,
        totalProducts: mockPuppies.length,
        totalUsers,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer:
          order.user?.name || order.firstName
            ? `${order.firstName} ${order.lastName}`
            : "Guest",
        status: order.status,
        total: order.total,
        email: order.user?.email || order.email,
        date: order.createdAt,
      })),
      topProducts: products.map((product, index) => ({
        id: product.id,
        name: product.name,
        category: product.breed,
        price: product.price,
        image: product.images?.[0] || "",
        sold: Math.floor(Math.random() * 50) + 10, // Random sold count for demo
      })),
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

export default async function AdminDashboardPage() {
  const { stats, recentOrders, topProducts } = await getDashboardData();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h2>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              subtitle="+20.1% from last month"
            />
            <StatCard
              title="Orders"
              value={stats.totalOrders}
              icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
              subtitle="+180.1% from last month"
            />
            <StatCard
              title="Products in Stock"
              value={stats.totalProducts}
              icon={<Package className="h-4 w-4 text-muted-foreground" />}
              subtitle="+12% from last month"
            />
            <StatCard
              title="Active Users"
              value={stats.totalUsers}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              subtitle="+19% from last month"
            />
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-muted/40 rounded-md">
                  <div className="text-center p-4">
                    <p className="text-muted-foreground mb-2">
                      Sales data visualization
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Revenue: ${stats.totalRevenue.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Orders: {stats.totalOrders}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between py-2 border-b"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              #{order.orderNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.customer}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.email}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              ${order.total.toFixed(2)}
                            </p>
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary">
                              {order.status}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">
                          No recent orders found
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <Button variant="ghost" className="w-full mt-4">
                  View all orders
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.length > 0 ? (
                    topProducts.map((product) => (
                      <div key={product.id} className="flex items-center py-2">
                        {product.image ? (
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 flex items-center justify-center bg-muted rounded-md mr-4">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="ml-4 flex-1">
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            ${product.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.sold} sold
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        No products found
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 1, action: "New order #1234", time: "2 min ago" },
                    {
                      id: 2,
                      action: "Product #456 updated",
                      time: "1 hour ago",
                    },
                    {
                      id: 3,
                      action: "New user registered",
                      time: "3 hours ago",
                    },
                    {
                      id: 4,
                      action: "Order #1233 shipped",
                      time: "5 hours ago",
                    },
                    { id: 5, action: "New product added", time: "1 day ago" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-start">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 mr-3" />
                      <div>
                        <p className="text-sm font-medium">{item.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
