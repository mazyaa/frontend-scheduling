export { Session, User } from "next-auth"; // for session typing
import { JWT } from "next-auth/jwt"; 
export interface ILogin {
    email: string;
    password: string;
}

export interface IUserExtended extends User {
    accessToken?: string;
    role?: string;
}

export interface ISessionExtended extends Session {
    accessToken?: string;
}

export interface IJWTExtended extends JWT {
    user?: UserExtended;
}