'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import MainFooter from "@/components/footers/MainFooter";
import MainHeader from "@/components/headers/MainHeader";
import LoadingScreen from '@/components/screens/LoadingScreen';
import useWindowDimensions from '@/hooks/useWindowDimension';

export default function RootLayout({ children }) {
  const router = useRouter();
  const {status} = useSession();
  const [statusLoading, setStatusLoading] = useState(true);
  const { width, height=500 } = useWindowDimensions();

  useEffect(() => {
    if(status==='unauthenticated'){
      router.push("/signin");
    }
    else if(status==='authenticated'){  
      setStatusLoading(false);
    }
  }, [status]);

  return (
    <div className="flex flex-col justify-center items-center w-full pt-10">
      <MainHeader/>
      {statusLoading?<LoadingScreen height={height-80}/>:children}
      <MainFooter/>
    </div>
  )
}