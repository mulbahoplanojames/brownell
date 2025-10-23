import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Returns an array of valid email domains
export function getValidEmailDomains() {
  const validDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];

  if (process.env.NODE_ENV === "development") {
    validDomains.push("example.com");
  }
  return validDomains;
}

// Returns a normalized name
export function getNormalizedName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z\s'-]/g, "")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Generates a unique order number in the format: ORD-YYYYMMDD-XXXX
 * Where XXXX is a random 4-character alphanumeric string
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${dateStr}-${randomStr}`;
}

/**
 * Formats a price with the specified currency
 */
export function formatPrice(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}
