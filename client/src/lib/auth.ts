import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { createUser, getUserByEmail } from './services/user';

if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) {
    throw new Error('Missing Google OAuth environment variables.');
}

const authConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: 'consent'
                }
            }
        })
    ],
    callbacks: {
        authorized({ auth }: any) {
            return !!auth?.user;
        },
        async signIn({ user }: any) {
            try {
                const existingGuest = await getUserByEmail(user.email);
                console.log('existingGuest', existingGuest);

                if (!existingGuest.success) {
                    console.log('12345678');

                    await createUser({
                        name: user.name,
                        email: user.email,
                        image: user.image
                    });
                }

                return true;
            } catch {
                return false;
            }
        }
    },
    pages: {
        signIn: '/login'
    }
};

export const {
    auth,
    signIn,
    signOut,
    handlers: { GET, POST }
} = NextAuth(authConfig);
