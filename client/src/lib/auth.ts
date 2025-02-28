import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';

const authConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID || '',
            clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
            authorization: {
                params: {
                    prompt: 'consent'
                }
            }
        }),
        Github({
            clientId: process.env.AUTH_GITHUB_ID || '',
            clientSecret: process.env.AUTH_GITHUB_SECRET || '',
            authorization: {
                params: {
                    prompt: 'consent'
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET
};

export const {
    auth,
    signIn,
    signOut,
    handlers: { GET, POST }
} = NextAuth(authConfig);
