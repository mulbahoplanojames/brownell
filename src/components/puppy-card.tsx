"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Puppy } from "@/lib/types";

interface PuppyCardProps {
  puppy: Puppy;
}

export function PuppyCard({ puppy }: PuppyCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow p-0">
      <Link href={`/puppy/${puppy.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={puppy.images[0] || "/placeholder.svg"}
            alt={puppy.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              // Add to favorites logic
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/puppy/${puppy.id}`}>
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg leading-tight">
                {puppy.name}
              </h3>
              <Badge variant="secondary">{puppy.gender}</Badge>
            </div>

            <p className="text-sm text-muted-foreground">{puppy.breed}</p>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{puppy.location}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                {puppy.age} weeks old
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground capitalize">
                {puppy.size}
              </span>
            </div>
          </div>
        </Link>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="text-2xl font-bold">
          ${puppy.price.toLocaleString()}
        </div>
        <Link href={`/puppy/${puppy.id}`}>
          <Button>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
