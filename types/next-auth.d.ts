import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            id?: string;
            role?: string;
            accessToken?: string;
        };
        accessToken?: string;
    }

    interface User extends DefaultUser {
        role?: string;
        accessToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user?: import("next-auth").User;
    }
}
