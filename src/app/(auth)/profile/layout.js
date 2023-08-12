import MainFooter from "@/components/footers/MainFooter";
import MainHeader from "@/components/headers/MainHeader";

export default function RootLayout({ children }) {

  return (
    <div className="flex flex-col justify-center items-center w-full pt-10">
      <MainHeader/>
      {children}
      <MainFooter/>
    </div>
  )
}