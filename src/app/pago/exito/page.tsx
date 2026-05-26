import { Suspense } from "react";
import { CheckoutSuccessClient } from "@/features/orders/CheckoutSuccessClient";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CheckoutSuccessClient />
    </Suspense>
  );
}