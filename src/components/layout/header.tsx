import logo from "@/../public/kazui-coin.svg";
import Image from "next/image";
import MobileMenu from "./mobile-menu";

export default function Header() {
  return (
    <header className="w-full main-wrapper min-h-header bg-background text-white border-b border-solid border-border">
      <div className="main-inner-wrapper flex items-center max-w-[111.5rem]">
        <div className="basis-1/3 flex items-center justify-start">
          <div
            className="relative h-10 mr-auto sm:mr-0"
            style={{ aspectRatio: logo.width / logo.height }}
          >
            <Image src={logo} alt="Kazui logo" fill />
          </div>
          <span className="hidden sm:inline ml-1 mr-auto text-center text-font-1 text-2xl">
            KAZUI
          </span>
        </div>
        <span className="sm:hidden ml-auto mr-auto text-center basis-1/3 text-font-1 text-2xl">
          KAZUI
        </span>
        <MobileMenu />
      </div>
    </header>
  );
}
