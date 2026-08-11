"use client";

import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SessionUser } from "@/lib/session";

export function UserMenu({ user }: { user: SessionUser }) {
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button type="button" className="cursor-pointer rounded-full" />
        }
      >
        <Avatar size="sm" className="cursor-pointer">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name} />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {user.name}
            <span className="block truncate text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {user.role === "ADMIN" ? (
          <>
            <DropdownMenuItem render={<Link href="/admin" />}>
              Admin dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <DropdownMenuItem render={<Link href="/account" />}>
          Account
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/account/orders" />}>
          My orders
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logout}>
          <DropdownMenuItem render={<button type="submit" />}>
            Sign out
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
