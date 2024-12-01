import logo from "@/../public/legyon.svg";
import { Irish_Grover } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Account from "./_components/account";
import Balance from "./_components/balance";
import BigScreenMenu from "./_components/big-screen-menu";
import MobileMenu from "./_components/mobile-menu";

const font = Irish_Grover({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Header() {
  return (
    <header className="w-full main-wrapper min-h-header bg-background text-white border-b border-solid border-border">
      <div className="main-inner-wrapper flex items-center max-w-[111.5rem]">
        <div className="max-sm:basis-1/3 flex items-center justify-start">
          <Link
            href="/"
            className="relative h-9 ml-[0.30rem] mr-auto sm:mr-0"
            style={{ aspectRatio: logo.width / logo.height }}
          >
            <Image decoding="sync" priority src={logo} alt="Legyon logo" fill />
          </Link>
        </div>
        <BigScreenMenu />
        <MobileMenu />
        <Balance />
        <Account />
      </div>
    </header>
  );
}
