"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Abertura } from "./abertura";
import { SiteNav } from "./site-nav";
import { SacolaDrawer } from "./sacola-drawer";
import { EditorialMotion } from "./editorial-motion";

export function SiteChrome({children,footer}:{children:ReactNode;footer:ReactNode}){
  const path=usePathname();
  const admin=path==="/admin"||path.startsWith("/admin/");
  return <>
    {!admin&&<><Abertura/><SiteNav/><EditorialMotion/></>}
    <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:bg-almond focus:px-5 focus:py-3 focus:text-ink">Ir para o conteúdo</a>
    <main id="conteudo">{children}</main>
    {!admin&&<>{footer}<SacolaDrawer/></>}
  </>;
}
