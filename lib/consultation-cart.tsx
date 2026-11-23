"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getObra } from "@/lib/catalogo-consulta";

type Line = {slug:string;qty:number};
type Cart = {lines:Line[];ready:boolean;count:number;add:(slug:string,qty?:number)=>void;setQty:(slug:string,qty:number)=>void};
const Context=createContext<Cart|null>(null);
const key="nobredna:consulta-livros-v1";
function parse(raw:unknown):Line[]{
  if(!Array.isArray(raw))return [];
  const map=new Map<string,number>();
  for(const item of raw){if(!item||typeof item.slug!=="string"||!getObra(item.slug)||!Number.isInteger(item.qty)||item.qty<1)continue;map.set(item.slug,Math.min(12,(map.get(item.slug)||0)+item.qty))}
  return Array.from(map,([slug,qty])=>({slug,qty}));
}
export function ConsultationProvider({children}:{children:ReactNode}){
  const [lines,setLines]=useState<Line[]>([]);
  const [ready,setReady]=useState(false);
  useEffect(()=>{try{setLines(parse(JSON.parse(localStorage.getItem(key)||"[]")))}catch{}setReady(true)},[]);
  useEffect(()=>{if(ready)try{localStorage.setItem(key,JSON.stringify(lines))}catch{}},[lines,ready]);
  const add=(slug:string,qty=1)=>{if(!getObra(slug))return;setLines(prev=>parse([...prev,{slug,qty}]))};
  const setQty=(slug:string,qty:number)=>setLines(prev=>prev.flatMap(line=>line.slug!==slug?[line]:qty<=0?[]:[{slug,qty:Math.min(12,Math.floor(qty))}]));
  return <Context.Provider value={{lines,ready,count:lines.reduce((sum,line)=>sum+line.qty,0),add,setQty}}>{children}</Context.Provider>;
}
export function useConsultationCart(){const cart=useContext(Context);if(!cart)throw new Error("Consulta sem provider");return cart}
