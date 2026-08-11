import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { hasAccessToken } from "@/lib/session";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  if (!(await hasAccessToken())) redirect("/login?next=/checkout");

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
      <div className="mt-6">
        <CheckoutForm />
      </div>
    </div>
  );
}
