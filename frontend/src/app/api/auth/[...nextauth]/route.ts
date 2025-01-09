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
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB); // Ensure you set `MONGODB_DB` in your `.env`
  return { db, client };
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
      async authorize(credentials, req) {
        // Fetch user credentials from your endpoint
        const res = await fetch("http://127.0.0.1:5000/api/signup.", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();

        if (res.ok && user) {
          // Add user to MongoDB
          const { db, client } = await connectToDatabase();
          try {
            const existingUser = await db.collection("users").findOne({ email: user.email });

            if (!existingUser) {
              // Add the user to the database
              await db.collection("users").insertOne({
                email: user.email,
                name: user.name || credentials?.username,
                createdAt: new Date(),
              });
            }
          } finally {
            client.close();
          }
          return user;
        }
        return null;
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
    async signIn({ user, account, profile }) {
      const { db, client } = await connectToDatabase();
      try {
        // Check if user exists and add them if they don't
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
        client.close();
      }
      return true;
    },
    async session({ session, user }) {
      // Include user ID in the session
      const { db, client } = await connectToDatabase();
      try {
        const existingUser = await db.collection("users").findOne({ email: session.user?.email });

        if (existingUser) {
          if (session.user) {
              session.user.id = existingUser._id.toString();
          }
        }
      } finally {
        client.close();
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
