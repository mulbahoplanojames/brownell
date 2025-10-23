import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function OrderConfirmationPage() {
  return (
    <main className=" flex items-center justify-center bg-muted/50">
      <div className="container mx-auto py-12">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">
                Order Confirmed!
              </h1>
              <p className="text-lg text-muted-foreground">
                Thank you for your purchase
              </p>
            </div>

            <div className="bg-muted rounded-lg p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-2xl font-bold">
                #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground">
                We have sent a confirmation email with your order details and
                next steps.
              </p>
              <p className="text-muted-foreground">
                The breeder will contact you shortly to arrange pickup or
                delivery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link href="/dashboard">
                <Button size="lg">View Order Details</Button>
              </Link>
              <Link href="/browse">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
