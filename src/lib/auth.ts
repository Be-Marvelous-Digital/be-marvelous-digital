import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPasswordHash) return null;
        if (email !== adminEmail) return null;

        // Compare submitted password against the stored value.
        // In production, ADMIN_PASSWORD should be a bcrypt hash.
        // If it's a plain password (dev only), compare directly.
        let isValid = false;

        if (adminPasswordHash.startsWith('$2')) {
          // bcrypt hash
          isValid = await bcrypt.compare(password, adminPasswordHash);
        } else {
          // Plain text — development only, warn loudly
          console.warn(
            '[Auth] ADMIN_PASSWORD is plain text. Hash it with bcrypt before deploying to production.',
          );
          isValid = password === adminPasswordHash;
        }

        if (!isValid) return null;

        return {
          id: '1',
          email: adminEmail,
          name: 'Peter Lehocky',
        };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
