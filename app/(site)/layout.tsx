import type {ReactNode} from "react";
import {CartProvider} from "@/lib/cart";
import {ConsultationProvider} from "@/lib/consultation-cart";
import {StoreCartProvider} from "@/lib/store-cart";
import {liveStoreEnabled} from "@/lib/store-public";
import {SiteFooter} from "@/components/site-footer";
import {SiteChrome} from "@/components/site-chrome";

// Public assets, animation and cart providers are not mounted in /admin.
export default function PublicLayout({children}:{children:ReactNode}){
 return <CartProvider><ConsultationProvider><StoreCartProvider enabled={liveStoreEnabled()}><SiteChrome footer={<SiteFooter/>}>{children}</SiteChrome></StoreCartProvider></ConsultationProvider></CartProvider>;
}
