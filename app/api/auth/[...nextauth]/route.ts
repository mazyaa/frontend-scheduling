import environtment from "@/config/env";
import { authServices } from "@/services/auth.service";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
    // use session as storage 
    session: {
        strategy: "jwt", 
        maxAge: 60 * 60 * 24, // 1 day, after which the user will be logged out 
    },

    secret: environtment.NEXTAUTH_SECRET,

    providers: [
        CredentialsProvider({
            type: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email"},
                password: { label: "Password", type: "password"},
            },

            async authorize(credentials) {
                const { email, password } = credentials as { email: string, password: string };

                const res =  await authServices.login({ email, password });

                const accessToken = res.data.data.token; // get the access token from the response, which will be used to get the user profile

                const me = await authServices.getProfileWithToken(accessToken); // get the user profile with the access token, which will be used to store the user data in the session

                const user = me.data.data; // get the user data from the response, which will be stored in the session

                if (accessToken && res.status === 200 && user.id && me.status === 200) {
                    user.accessToken = accessToken; // add the access token to the user object, so it can be used in the jwt callback

                    return user; // return the user object, which will be stored in the session
                }
            }
        }),
    ],

    callbacks: {

        // cretaing a jwt token with the user data, which will be stored in the session
        async jwt({ token, account, user }: { token: any, account: any, user: any }) {
            if (account?.provider === "credentials") {
                token.email = user.email;
                token.name = user.name;
                token.role = user.role;
            }

            return token;
        },

        // creating a session with the user data from the jwt token, which will be used in the client side to check if the user is authenticated and to get the user data   
        async session({ session, token }: { session: any, token: any }) {
            if ("email" in token) {
                session.user.email = token.email;
            }

            if ("name" in token) {
                session.user.name = token.name;
            }

            if ("role" in token) {
                session.user.role = token.role;
            }

            return session;
        }
    },

    pages: {
        signIn: "/login", // custom login page
        signOut: "/",
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };