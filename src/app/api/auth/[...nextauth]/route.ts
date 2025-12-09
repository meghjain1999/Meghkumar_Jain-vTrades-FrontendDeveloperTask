import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";

const handler = NextAuth({
    session: { strategy: "jwt" },

    // confifuring Google and Microsoft Provider
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        AzureADProvider({
            clientId: process.env.MS_CLIENT_ID!,
            clientSecret: process.env.MS_CLIENT_SECRET!,
            tenantId: process.env.MS_TENANT_ID!,
        }),
    ],

    callbacks: {
        async signIn() {
            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.email = token.email;
                session.user.name = token.name;
            }
            return session;
        },

        async redirect() {
            return "/dashboard";
        },
    },

    pages: {
        signIn: "/signin",
    },
});


export { handler as GET, handler as POST };
