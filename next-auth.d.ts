import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "Donor" | "Volunteer" | "Beneficiary" | "Staff" | null;
      programInterests?: string[] | null; // e.g., ["Education", "Healthcare"]
    };
  }

  interface User {
    id: string;
    role?: "Donor" | "Volunteer" | "Beneficiary" | "Staff" | null;
    programInterests?: string[] | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: "Donor" | "Volunteer" | "Beneficiary" | "Staff" | null;
    programInterests?: string[] | null;
  }
}
