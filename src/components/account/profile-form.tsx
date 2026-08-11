"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client-api";
import { updateSessionInfo } from "@/lib/actions/auth";
import type { SessionUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ProfileForm({ session }: { session: SessionUser }) {
  const router = useRouter();
  const [name, setName] = useState(session.name);
  const [image, setImage] = useState(session.image ?? "");
  const [phone, setPhone] = useState(session.phone ?? "");
  const [address, setAddress] = useState(session.address ?? "");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setPending(true);
    setError(null);
    setMessage(null);

    const payload: Record<string, string> = {
      name,
      image,
      phone,
      address,
    };

    const res = await api(`/users/${session.id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    setPending(false);
    if (res.status >= 400) {
      setError(res.message || "Update failed");
      return;
    }

    await updateSessionInfo({
      id: session.id,
      name,
      email: session.email,
      role: session.role,
      image,
      address,
      phone,
    });
    setMessage("Profile updated");
    router.refresh();
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={session.email} disabled />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 000 0000"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street, city, country"
          />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {message ? <p className="text-sm text-primary">{message}</p> : null}
      </CardContent>
      <CardFooter>
        <Button onClick={save} disabled={pending}>
          {pending ? "Saving..." : "Save changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
