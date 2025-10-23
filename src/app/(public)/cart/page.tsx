"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 py-12">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-bold">Your cart is empty</h1>
            <p className="text-muted-foreground">
              Add some puppies to your cart to get started
            </p>
            <Link href="/browse">
              <Button size="lg">Browse Puppies</Button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
          <Button variant="ghost" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.puppyId}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Link
                      href={`/puppy/${item.puppy.id}`}
                      className="relative w-32 h-32 flex-shrink-0"
                    >
                      <Image
                        src={item.puppy.images[0] || "/placeholder.svg"}
                        alt={item.puppy.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </Link>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/puppy/${item.puppy.id}`}>
                            <h3 className="font-semibold text-lg hover:text-primary">
                              {item.puppy.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {item.puppy.breed}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.puppyId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="capitalize">{item.puppy.gender}</span>
                        <span>•</span>
                        <span>{item.puppy.age} weeks</span>
                        <span>•</span>
                        <span>{item.puppy.location}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-2xl font-bold">
                          ${item.puppy.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">
                      ${total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-semibold">{items.length}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">${total.toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button size="lg" className="w-full mt-6">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link href="/browse">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full mt-2 bg-transparent"
                  >
                    Continue Shopping
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Secure checkout powered by Stripe
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
