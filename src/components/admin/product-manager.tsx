"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PackageIcon } from "lucide-react";
import { api } from "@/lib/client-api";
import type { Category, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ProductManager({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState(
    editing?.categoryId ?? categories[0]?.id ?? "",
  );

  const formOpen = creating || editing !== null;

  function openForm(product: Product | null) {
    if (product) {
      setEditing(product);
      setCategoryId(product.categoryId);
    } else {
      setCreating(true);
      setCategoryId(categories[0]?.id ?? "");
    }
    setError(null);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
    setError(null);
  }

  async function save(formData: FormData) {
    setPending(true);
    setError(null);
    const payload = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: Number(formData.get("price") ?? 0),
      stock: Number(formData.get("stock") ?? 0),
      image: String(formData.get("image") ?? ""),
      categoryId,
    };
    const res = editing
      ? await api<Product>(`/products/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      : await api<Product>("/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
    setPending(false);
    if (res.status >= 400) {
      setError(res.message || "Save failed");
      return;
    }
    closeForm();
    router.refresh();
  }

  async function remove() {
    if (!deleting) return;
    setPending(true);
    setError(null);
    const res = await api<Product>(`/products/${deleting.id}`, {
      method: "DELETE",
    });
    setPending(false);
    if (res.status >= 400) {
      setError(res.message || "Delete failed");
      return;
    }
    setDeleting(null);
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} products
          </p>
        </div>
        <Button onClick={() => openForm(null)} disabled={categories.length === 0}>
          New product
        </Button>
      </div>

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No products yet.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image ? (
                    <div className="relative size-10 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                      <PackageIcon className="size-5 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category?.name ?? "—"}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openForm(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 text-destructive"
                    onClick={() => setDeleting(product)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit product" : "New product"}
            </DialogTitle>
          </DialogHeader>
          <form action={save} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="prod-name">Name</Label>
              <Input
                id="prod-name"
                name="name"
                required
                defaultValue={editing?.name ?? ""}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="prod-description">Description</Label>
              <Textarea
                id="prod-description"
                name="description"
                defaultValue={editing?.description ?? ""}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="prod-price">Price</Label>
                <Input
                  id="prod-price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={editing?.price ?? 0}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="prod-stock">Stock</Label>
                <Input
                  id="prod-stock"
                  name="stock"
                  type="number"
                  min="0"
                  required
                  defaultValue={editing?.stock ?? 0}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="prod-category">Category</Label>
              <Select value={categoryId} onValueChange={(v) => v && setCategoryId(v)}>
                <SelectTrigger id="prod-category" className="w-full">
                  <SelectValue>
                    {categories.find((c) => c.id === categoryId)?.name ?? "Select"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="prod-image">Image URL</Label>
              <Input
                id="prod-image"
                name="image"
                placeholder="https://..."
                defaultValue={editing?.image ?? ""}
              />
            </div>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeForm}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : editing ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Delete product"
        description={
          deleting ? `Delete "${deleting.name}"? This is a soft delete.` : ""
        }
        onConfirm={remove}
        pending={pending}
      />
    </div>
  );
}
