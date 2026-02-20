import type { DefaultSession, User as NextAuthUser } from "next-auth";
import type { JWT as NextAuthJWT } from "next-auth/jwt";

export interface ILogin {
    email: string;
    password: string;
}

export interface IUserExtended extends NextAuthUser {
    accessToken?: string;
    role?: string;
}

export interface ISessionExtended extends DefaultSession {
    user?: IUserExtended;
    accessToken?: string;
}

export interface IJWTExtended extends NextAuthJWT {
    user?: IUserExtended;
}