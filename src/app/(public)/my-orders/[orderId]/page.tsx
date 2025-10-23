import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"

export default async function OrderDetailsPage({
  params,
}: {
  params: { orderId: string }
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect(`/login?callbackUrl=/my-orders/${params.orderId}`)
  }

  const order = await prisma.order.findUnique({
    where: {
      id: params.orderId,
      userId: session.user.id,
    },
    include: {
      items: true,
    },
  })

  if (!order) {
    notFound()
  }

  const getStatusDetails = () => {
    switch (order.status) {
      case 'PENDING':
        return {
          icon: <Clock className="h-5 w-5 text-amber-500" />,
          title: "Order Placed",
          description: "We've received your order and are processing it.",
          color: "text-amber-500"
        }
      case 'PROCESSING':
        return {
          icon: <Package className="h-5 w-5 text-blue-500" />,
          title: "Processing",
          description: "Your order is being prepared for shipment.",
          color: "text-blue-500"
        }
      case 'SHIPPED':
        return {
          icon: <Truck className="h-5 w-5 text-indigo-500" />,
          title: "Shipped",
          description: "Your order is on the way!",
          color: "text-indigo-500"
        }
      case 'DELIVERED':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          title: "Delivered",
          description: "Your order has been delivered.",
          color: "text-green-500"
        }
      case 'CANCELLED':
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          title: "Cancelled",
          description: "This order has been cancelled.",
          color: "text-red-500"
        }
      case 'REFUNDED':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          title: "Refunded",
          description: "Your refund has been processed.",
          color: "text-green-500"
        }
      default:
        return {
          icon: <Package className="h-5 w-5 text-gray-500" />,
          title: order.status,
          description: "",
          color: "text-gray-500"
        }
    }
  }

  const statusDetails = getStatusDetails()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0">
          <Link href="/my-orders" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Order #{order.orderNumber}</h1>
          <Badge variant="outline" className={statusDetails.color}>
            {order.status}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="p-4 flex items-start gap-4">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
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
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-medium">{order.firstName} {order.lastName}</p>
                <p className="text-muted-foreground">{order.email}</p>
                <p className="text-muted-foreground">{order.phone}</p>
              </div>
              <div className="mt-4">
                <p>{order.street}</p>
                <p>{order.city}, {order.state} {order.zipCode}</p>
                <p>{order.country}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${statusDetails.color}`}>
                  {statusDetails.icon}
                </div>
                <div>
                  <h4 className="font-medium">{statusDetails.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {statusDetails.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">
                    {order.paymentMethod === 'STRIPE' && 'Credit/Debit Card'}
                    {order.paymentMethod === 'PAYPAL' && 'PayPal'}
                    {order.paymentMethod === 'MOBILE_MONEY' && 'Mobile Money'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className="font-medium">
                    {order.paymentStatus === 'PENDING' && (
                      <Badge variant="outline">Pending</Badge>
                    )}
                    {order.paymentStatus === 'COMPLETED' && (
                      <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
                    )}
                    {order.paymentStatus === 'FAILED' && (
                      <Badge variant="destructive">Failed</Badge>
                    )}
                    {order.paymentStatus === 'REFUNDED' && (
                      <Badge variant="outline">Refunded</Badge>
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
