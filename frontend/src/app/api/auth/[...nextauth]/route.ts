import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

console.log('GOOGLE_CLIENT_ID:', process.env.AUTH_GOOGLE_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.AUTH_GOOGLE_SECRET);
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET);
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
