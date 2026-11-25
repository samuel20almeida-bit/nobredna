"use client";
import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from "react";
import type {StoreLine} from "./store-types";

type Cart = {enabled:boolean;ready:boolean;lines:StoreLine[]; count:number; add:(slug:string,max:number)=>void;setQty:(slug:string,qty:number,max:number)=>void;clear:()=>void};
const Context=createContext<Cart|null>(null);
const KEY="nobredna:commercial-cart-v1";
function sanitize(raw:unknown):StoreLine[]{
 if(!Array.isArray(raw))return [];
 const map=new Map<string,number>();
 for(const row of raw.slice(0,30)){
  if(!row||typeof row!=="object"||typeof row.slug!=="string"||row.slug.length>120||!(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(row.slug))||!Number.isInteger(row.qty)||row.qty<1)continue;
  map.set(row.slug,Math.min(12,(map.get(row.slug)??0)+row.qty));
 }
 let remaining=30;
 return [...map].flatMap(([slug,qty])=>{const safe=Math.min(qty,remaining);remaining-=safe;return safe>0?[{slug,qty:safe}]:[]});
}
export function StoreCartProvider({children,enabled}:{children:ReactNode;enabled:boolean}){
 const [lines,setLines]=useState<StoreLine[]>([]),[ready,setReady]=useState(false);
 useEffect(()=>{try{setLines(sanitize(JSON.parse(localStorage.getItem(KEY)??"[]")))}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(KEY,JSON.stringify(lines))}catch{}},[ready,lines]);
 const value=useMemo<Cart>(()=>({enabled,ready,lines,count:lines.reduce((s,l)=>s+l.qty,0),
  add:(slug,max)=>setLines(prev=>{const count=prev.reduce((s,l)=>s+l.qty,0),exists=prev.find(l=>l.slug===slug);if(count>=30||max<1)return prev;return exists?prev.map(l=>l.slug===slug?{slug,qty:Math.min(max,12,l.qty+1)}:l):[...prev,{slug,qty:1}]}),
  setQty:(slug,qty,max)=>setLines(prev=>{const other=prev.filter(l=>l.slug!==slug).reduce((s,l)=>s+l.qty,0);const n=Math.min(max,12,30-other,Math.max(0,Math.floor(qty)));return n>0?prev.map(l=>l.slug===slug?{slug,qty:n}:l):prev.filter(l=>l.slug!==slug)}),clear:()=>setLines([])}),[enabled,ready,lines]);
 return <Context.Provider value={value}>{children}</Context.Provider>
}
export function useStoreCart(){const context=useContext(Context);if(!context)throw new Error("StoreCartProvider missing");return context;}
