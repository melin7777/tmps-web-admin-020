import MainFooter from "@/components/footers/MainFooter";
import MainHeader from "@/components/headers/MainHeader";

export default function RootLayout({ children }) {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <MainHeader/>
      {children}
      <MainFooter/>
    </div>
  )
}