'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainFooter from "@/components/footers/MainFooter";
import MainHeader from "@/components/headers/MainHeader";

export default function RootLayout({ children }) {
  const router = useRouter();
  const {status} = useSession();

  useEffect(() => {
    if(status==="unauthenticated"){
      router.push("/signin");
    }
  }, [status]);

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <MainHeader/>
        {children}
      <MainFooter/>
    </div>
  )
}