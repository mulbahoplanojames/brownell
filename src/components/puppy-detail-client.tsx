"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCart } from "@/lib/cart-context";
import {
  MapPin,
  Calendar,
  Heart,
  MessageCircle,
  CheckCircle,
  Star,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";

import type { Puppy } from "@/lib/types";
import { toast } from "sonner";

interface PuppyDetailClientProps {
  puppy: Puppy;
}

export function PuppyDetailClient({ puppy }: PuppyDetailClientProps) {
  const { addToCart, items } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);

  const isInCart = items.some((item) => item.puppyId === puppy.id);

  const handleAddToCart = () => {
    addToCart(puppy);
    toast.success("Added to cart", {
      description: `${puppy.name} has been added to your cart.`,
    });
  };

  return (
    <>
      <div className="container mx-auto py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 te xt-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/browse" className="hover:text-foreground">
            Browse
          </Link>
          <span>/</span>
          <span className="text-foreground">{puppy.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={puppy.images[selectedImage] || "/placeholder.svg"}
                alt={puppy.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {puppy.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg bg-muted border-2 transition-colors ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${puppy.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Puppy Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{puppy.name}</h1>
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xl text-muted-foreground">{puppy.breed}</p>
            </div>

            <div className="flex items-center gap-4">
              <Badge
                variant="secondary"
                className="text-base px-3 py-1 capitalize"
              >
                {puppy.gender}
              </Badge>
              <Badge
                variant="secondary"
                className="text-base px-3 py-1 capitalize"
              >
                {puppy.size}
              </Badge>
              <Badge
                variant={
                  puppy.availability === "available" ? "default" : "secondary"
                }
                className="text-base px-3 py-1 capitalize"
              >
                {puppy.availability}
              </Badge>
            </div>

            <div className="text-4xl font-bold">
              ${puppy.price.toLocaleString()}
            </div>

            <div className="flex gap-3">
              {puppy.availability === "available" && (
                <>
                  {isInCart ? (
                    <Link href="/cart" className="flex-1">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        View in Cart
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handleAddToCart}
                      className="flex-1"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </>
              )}
              <Button size="lg" variant="outline">
                <MessageCircle className="h-5 w-5 mr-2" />
                Contact Breeder
              </Button>
            </div>

            <Separator />

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-semibold">{puppy.age} weeks</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{puppy.location}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Health Info */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Health Information</h3>
              <div className="grid grid-cols-2 gap-3">
                {puppy.healthInfo.vaccinated && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Vaccinated</span>
                  </div>
                )}
                {puppy.healthInfo.dewormed && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Dewormed</span>
                  </div>
                )}
                {puppy.healthInfo.vetChecked && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Vet Checked</span>
                  </div>
                )}
                {puppy.healthInfo.healthCertificate && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Health Certificate</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description & Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About {puppy.name}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {puppy.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Temperament</h2>
                <div className="flex flex-wrap gap-2">
                  {puppy.temperament.map((trait) => (
                    <Badge
                      key={trait}
                      variant="secondary"
                      className="text-sm px-3 py-1"
                    >
                      {trait}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Additional Details</h2>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Color</dt>
                    <dd className="font-semibold">{puppy.color}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Size Category</dt>
                    <dd className="font-semibold capitalize">{puppy.size}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Listed Date</dt>
                    <dd className="font-semibold">
                      {puppy.createdAt.toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          {/* Breeder Info */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Breeder Information</h2>

                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={puppy.breeder.avatar || "/placeholder.svg"}
                      alt={puppy.breeder.businessName}
                    />
                    <AvatarFallback>
                      {puppy.breeder.businessName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {puppy.breeder.businessName}
                    </h3>
                    {puppy.breeder.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-semibold">
                      {puppy.breeder.rating}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({puppy.breeder.totalReviews} reviews)
                  </span>
                </div>

                {puppy.breeder.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {puppy.breeder.description}
                  </p>
                )}

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{puppy.breeder.location}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-4 bg-transparent"
                  variant="outline"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Breeder
                </Button>

                <Link href={`/breeder/${puppy.breeder.id}`}>
                  <Button className="w-full mt-2" variant="ghost">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
