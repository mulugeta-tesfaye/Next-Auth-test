import Link from "next/link";
import  {NavigationMenuDemo } from "./components/navbar"
import { getServerSession } from "next-auth";
import { authOption } from "./api/auth/[...nextauth]/route";
import { Span } from "next/dist/trace";

export default async function Home() {
  const session = await getServerSession(authOption)
  return(
    <>

   < NavigationMenuDemo />
    <main><h2>Hello {session && <span>{ session.user!.name }</span> } </h2>
    <br />

    <a href="/users">Users a</a> <br />
    <Link href="/users">Users Link</Link>
    </main>
  
    </>
  )
}