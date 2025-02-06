import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';

// if (!process.env.NEXT_AUTH_GOOGLE_ID || !process.env.NEXT_AUTH_GOOGLE_SECRET) {
//     // throw new Error('Missing Google OAuth environment variables.');
//     console.log(process.env.NEXT_AUTH_GOOGLE_ID);
// }

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
    // callbacks: {
    //     authorized({ auth }: any) {
    //         return !!auth?.user;
    //     },
    //     async signIn({ user }: any) {
    //         try {
    //             const existingGuest = await getUserByEmail(user.email);
    //             console.log('existingGuest', existingGuest);

    //             if (!existingGuest.success) {
    //                 console.log('12345678');

    //                 await createUser({
    //                     name: user.name,
    //                     email: user.email,
    //                     image: user.image
    //                 });
    //             }

    //             return true;
    //         } catch {
    //             return false;
    //         }
    //     }
    // },
    // pages: {
    //     signIn: '/login'
    // }
};

export const {
    auth,
    signIn,
    signOut,
    handlers: { GET, POST }
} = NextAuth(authConfig);
