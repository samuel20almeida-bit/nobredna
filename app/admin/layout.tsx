import type {ReactNode} from "react";
import {AdminNavigationProvider} from "@/components/admin-navigation";

// Persistent across the panel's query-string navigation. It contains no
// session or private data; each page and action verifies access independently.
export default function AdminLayout({children}:{children:ReactNode}){
 return <AdminNavigationProvider><a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:bg-almond focus:px-5 focus:py-3 focus:text-ink">Ir para o conteúdo</a><main id="conteudo">{children}</main></AdminNavigationProvider>;
}
