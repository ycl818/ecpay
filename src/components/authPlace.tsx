'use client'

import * as actions from "@/actions";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function SecretContent() {
  const session = useSession();


  if (!session.data?.user) {
    return redirect("/")
  }
  return <>
        <span>Hey</span>
        <form
          action={actions.signOut}
        >
          <button type="submit">Sign out</button>
        </form>
        
 </> 
}