import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {},
      authorize: async (credentials)=>{
        const {email, password} = credentials;
        const res = await fetch("https://tm-web.techmax.lk/online-users/signin-web", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userType: 'admin',
            email: email,
            password: password
          })
        });
        const response = await res.json();
        if(!response.error){
          if(response.data.status==="inactive"){
            return null;
          }
          return {
            name: response.data.first_name+" "+response.data.last_name,
            email: response.data.email,
            image: response.data.image_url,
          };
        }
        else{
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({account, profile}) {
      return true;
    },
    async jwt({ token, trigger, session }) {
      return token;
    },
    session: async ({session, token})=>{
      session.sub = token.sub;
      session.iat = token.iat;
      session.exp = token.exp;
      session.jti = token.jti;
      const res = await fetch("https://tm-web.techmax.lk/online-users/find-by-email-web", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: token.email
        })
      });
      const user = await res.json();
      if(!user.error){
        session.user = {
          id: user.data.id,
          userType: user.data.user_type,
          name: user.data.first_name+" "+user.data.last_name,
          email: user.data.email,
          image: user.data.image_url,
          notifyBy: user.data.notify_by,
          status: user.data.status,
        };
        return session;
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
  pages: {
    signIn: "/signin",
    error: "/signin/error",
  }
})

export { handler as GET, handler as POST }