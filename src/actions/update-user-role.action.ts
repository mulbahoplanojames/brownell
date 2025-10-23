"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

const VALID_ROLES = ["ADMIN", "CUSTOMER", "GUEST", "SELLER"] as const;

export async function updateUserRoleAction(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const userId = String(formData.get("userId") || "");
  const role = String(formData.get("role") || "").toUpperCase();

  if (
    !userId ||
    !role ||
    !VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])
  ) {
    return { success: false, error: "Invalid input" };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    console.error("[updateUserRoleAction]", err);
    return { success: false, error: "Update failed" };
  }
}
