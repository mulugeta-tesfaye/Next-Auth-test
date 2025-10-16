import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"


 const prisma = new PrismaClient();

export const authOption:NextAuthOptions = { 
 adapter:PrismaAdapter(prisma),
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!
  }),

  CredentialsProvider({
    name:"Credentials",
    credentials:{
      email:{label:"Email", type:"email", placeholder:"example@type.com" },
      password:{ label:"Password", type:"password",placeholder:"password" }
    },
    async authorize(credentials, req) {
      if(!credentials?.email || !credentials.password)
        return null

      const user = await prisma.user.findUnique( {
        where: {email:credentials.email}
       })
       
      if(!user) return null

      const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword!)
      return passwordMatch?user:null
    },
  })
],
session:{
  strategy:'jwt'
}
}

const handler = NextAuth(authOption)
export { handler as GET, handler as POST }
