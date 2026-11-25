"use client";
import {useEffect} from "react";
import {useStoreCart} from "@/lib/store-cart";
export function StorePaymentReturn({reference}:{reference:string}){
 const cart=useStoreCart();
 useEffect(()=>{if(!cart.ready)return;try{const attempt=JSON.parse(sessionStorage.getItem("nobredna:checkout-attempt")??"null");if(attempt?.reference===reference){if(JSON.stringify(attempt.items)===JSON.stringify(cart.lines))cart.clear();sessionStorage.removeItem("nobredna:checkout-attempt");sessionStorage.removeItem("nobredna:checkout-key")}}catch{}},[reference,cart]);
 return null;
}
