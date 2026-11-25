import "server-only";
import {createHmac} from "node:crypto";
import {isIP} from "node:net";
import {commerceClient} from "@/lib/store-commerce";
export async function allowStoreRequest(request:Request,scope:"quote"|"checkout"){
 const secret=process.env.STORE_RATE_LIMIT_SECRET;
 const ip=request.headers.get("x-vercel-forwarded-for")?.trim();
 if(!secret||!ip||!isIP(ip))return false;
 const key=createHmac("sha256",secret).update(ip).digest("hex");
 const {data,error}=await commerceClient().rpc("store_allow_request",{p_scope:scope,p_hash:key});
 if(error)throw Error("request_limit_unavailable");
 return data===true;
}
