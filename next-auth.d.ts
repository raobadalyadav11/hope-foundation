import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "admin" | "donor" | "volunteer" | "creator" | null;
      programInterests?: string[] | null; // e.g., ["Education", "Healthcare"]
    };
  }

  interface User {
    id: string;
    role?: "admin" | "donor" | "volunteer" | "creator" | null;
    programInterests?: string[] | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: "admin" | "donor" | "volunteer" | "creator" | null;
    programInterests?: string[] | null;
  }
}
