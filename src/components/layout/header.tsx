import logo from "@/../public/logo-2.svg";
import { Irish_Grover } from "next/font/google";
import Image from "next/image";
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
          <div
            className="relative h-10 mr-auto sm:mr-0"
            style={{ aspectRatio: logo.width / logo.height }}
          >
            <Image decoding="sync" priority src={logo} alt="Kazui logo" fill />
          </div>
          <span
            className={`hidden sm:inline ml-2 mr-auto text-center text-white text-2xl ${font.className}`}
          >
            PORTAL
          </span>
        </div>
        <span
          className={`sm:hidden ml-auto mr-auto text-center basis-1/3 text-white text-2xl ${font.className}`}
        >
          PORTAL
        </span>
        <BigScreenMenu />
        <MobileMenu />
        <Balance />
        <Account />
      </div>
    </header>
  );
}
