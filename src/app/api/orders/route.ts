import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// Define types for the request body
type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type OrderRequest = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  paymentMethod: "STRIPE" | "PAYPAL" | "MOBILE_MONEY";
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized - No valid session found" },
        { status: 401 }
      );
    }

    // Validate session user ID format if it exists
    let userId: string | undefined = undefined;
    if (session.user.id) {
      try {
        // If the ID is a valid MongoDB ObjectID, use it
        if (/^[0-9a-fA-F]{24}$/.test(session.user.id)) {
          userId = session.user.id;
        } else {
          console.warn(
            "User ID is not a valid MongoDB ObjectID:",
            session.user.id
          );
          // Continue without user ID (creates an order without user association)
          // Or uncomment the following line to return an error instead:
          // return NextResponse.json({ error: "Invalid user session" }, { status: 401 });
        }
      } catch (error) {
        console.error("Error validating user ID:", error);
        // Continue without user ID
      }
    }

    const data: OrderRequest = await request.json();

    // Validate required fields
    const requiredFields: (keyof OrderRequest)[] = [
      "email",
      "firstName",
      "lastName",
      "phone",
      "street",
      "city",
      "state",
      "zipCode",
      "country",
      "paymentMethod",
      "items",
      "subtotal",
      "shipping",
      "tax",
      "total",
    ];

    const missingFields = requiredFields.filter(
      (field) => data[field] === undefined || data[field] === null
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate items
    if (!Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    // Generate a unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create the order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: "PENDING",
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        paymentMethod: data.paymentMethod,
        paymentStatus: "PENDING",
        subtotal: data.subtotal,
        shipping: data.shipping,
        tax: data.tax,
        total: data.total,
        userId: userId,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Here you would typically process the payment with a payment provider
    // For now, we'll simulate a successful payment
    const paymentResult = { success: true, paymentId: `pay_${uuidv4()}` };

    if (paymentResult.success) {
      // Update order with payment details
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "COMPLETED",
          paymentId: paymentResult.paymentId,
          status: "PROCESSING",
        },
      });

      return NextResponse.json({
        success: true,
        order: updatedOrder,
        message: "Order created successfully",
      });
    } else {
      // If payment fails, update order status
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "FAILED",
          status: "CANCELLED",
        },
      });

      return NextResponse.json(
        { error: "Payment processing failed" },
        { status: 402 }
      );
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching orders" },
      { status: 500 }
    );
  }
}
