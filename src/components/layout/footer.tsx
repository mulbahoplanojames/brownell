import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container   mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 fill-primary text-primary" />
              <span className="text-xl font-bold">PawsMarket</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting loving families with ethical breeders and healthy
              puppies.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Browse</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/browse"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Puppies
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?size=small"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Small Breeds
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?size=medium"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Medium Breeds
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?size=large"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Large Breeds
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/become-seller"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Become a Seller
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} PawsMarket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
