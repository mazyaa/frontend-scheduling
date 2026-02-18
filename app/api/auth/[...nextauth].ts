import environtment from "@/config/env";
import NextAuth from "next-auth";
import { CredentialsProvider } from "next-auth/providers/credentials";
import { authServices } from "@/services/auth.service";
import { IJWTExtended, ISessionExtended, IUserExtended } from "@/types/Auth";
