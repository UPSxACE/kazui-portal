import logo from "@/../public/kazui-coin.svg";
import Image from "next/image";
import MobileMenu from "./mobile-menu";

export default function Header() {
  return (
    <header className="w-full main-wrapper min-h-header bg-background text-white border-b border-solid border-zinc-500/40">
      <div className="main-inner-wrapper flex items-center">
        <div className="basis-1/3">
          <div
            className="relative h-10 mr-auto"
            style={{ aspectRatio: logo.width / logo.height }}
          >
            <Image src={logo} alt="Kazui logo" fill />
          </div>
        </div>
        <span className="ml-auto mr-auto text-center basis-1/3 text-font-1 text-2xl">
          KAZUI
        </span>
        <MobileMenu />
      </div>
    </header>
  );
}
