import NextAuth, { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";

// MongoDB connection function
const connectToDatabase = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URL!);
    await client.connect();
    const db = client.db("example");
    return { db, client };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Database connection error");
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://127.0.0.1:5000/api/signup", {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) {
            throw new Error("Invalid credentials");
          }

          const user = await res.json();

          // Add user to MongoDB if not already present
          const { db, client } = await connectToDatabase();
          try {
            const existingUser = await db.collection("users").findOne({ email: user.email });

            if (!existingUser) {
              await db.collection("users").insertOne({
                email: user.email,
                name: user.name || credentials?.username,
                createdAt: new Date(),
              });
            }
          } finally {
            await client.close();
          }

          return user;
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    newUser: "/auth/signup",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      try {
        const { db, client } = await connectToDatabase();
        try {
          const existingUser = await db.collection("users").findOne({ email: user.email });

          if (!existingUser) {
            await db.collection("users").insertOne({
              email: user.email,
              name: user.name,
              image: user.image,
              createdAt: new Date(),
              provider: account?.provider,
            });
          }
        } finally {
          await client.close();
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async session({ session }) {
      try {
        const { db, client } = await connectToDatabase();
        try {
          const existingUser = await db.collection("users").findOne({ email: session.user?.email });

          if (existingUser && session.user) {
            session.user.id = existingUser._id.toString();
          }
        } finally {
          await client.close();
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
