import React from "react";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Prisma } from "../../../../../generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { updateUserRoleAction } from "@/actions/update-user-role.action";

type SearchParams = {
  q?: string;
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const q = (searchParams?.q || "").trim();

  const where: Prisma.UserWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
          // allow quick role matches like "admin"
          { role: { equals: q.toUpperCase() as any } },
        ],
      }
    : {};

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      image: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3">
        <h1 className="text-3xl font-semibold">Users</h1>
        <span className="text-sm text-muted-foreground">
          {users.length} result{users.length === 1 ? "" : "s"}
        </span>
      </div>

      <form className="flex gap-2 w-full" method="get">
        <Input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name, email, or role"
          className="flex-1"
        />
        <Button
          type="submit"
          className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Search
        </Button>
      </form>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b text-left">
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Verified</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-center text-muted-foreground"
                  colSpan={5}
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="px-4 py-3 align-top">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "long",
                    }).format(new Date(u.createdAt))}
                  </td>
                  <td className="px-4 py-3 align-top">{u.name}</td>
                  <td className="px-4 py-3 align-top">{u.email}</td>
                  <td className="px-4 py-3 align-top">
                    <form
                      action={async (formData) => {
                        "use server";
                        await updateUserRoleAction(formData);
                      }}
                      className="flex items-center gap-2"
                    >
                      <input type="hidden" name="userId" value={u.id} />
                      <select
                        name="role"
                        defaultValue={u.role}
                        className="h-9 rounded-md border bg-background px-3 text-sm shadow-sm"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="SELLER">SELLER</option>
                      </select>
                      <Button type="submit" size="sm" variant="secondary">
                        Save
                      </Button>
                    </form>
                  </td>
                  <td className="px-4 py-3 align-top">
                    {u.emailVerified ? "Yes" : "No"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
