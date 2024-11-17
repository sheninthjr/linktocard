import prisma from '@/db';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        if (
          session?.user?.email &&
          session?.user?.name &&
          session?.user?.image
        ) {
          const user = await prisma.user.findUnique({
            where: {
              email: session?.user?.email,
            },
          });
          if (user) {
            session.user.id = user.id;
          } else {
            const newUser = await prisma.user.create({
              data: {
                email: session?.user?.email,
                name: session?.user?.name,
                image: session?.user?.image,
              },
            });
            session.user.id = newUser.id;
          }
        }
      } catch (e) {
        console.error('Error while storing the user in the database', e);
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
