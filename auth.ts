import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.name = session.user.name || token.name || 'Community Member';
        session.user.email = session.user.email || token.email || '';
        session.user.image = session.user.image || (token.picture as string) || '';
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'portfolio-ashik-nextauth-secret-key-2026',
};
