"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

/** Esvazia a sacola quando o pagamento volta aprovado do Mercado Pago. */
export function LimparSacola() {
  const { clear, ready } = useCart();

  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);

  return null;
}
