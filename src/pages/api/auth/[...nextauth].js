import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../utils/db';
import User from '../../../models/User';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials.email });
        
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          if (user.role === 'admin') {
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role
            };
          }
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        console.log('JWT callback - initial sign in:', { user });
        return {
          ...token,
          id: user.id,
          role: user.role,
        };
      }
      
      console.log('JWT callback - subsequent request:', { token });
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        console.log('Session callback:', { session });
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'your-default-secret-do-not-use-in-production',
});