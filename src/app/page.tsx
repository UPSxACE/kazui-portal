import { IoCompassOutline } from "react-icons/io5";
import Posts from "./_components/posts";

export default function Page() {
  return (
    <main className="bg-background text-font-1 gradient-1 h-landing flex flex-col overflow-y-auto hide-scroll">
      <header className="main-wrapper border-b border-solid border-zinc-500/40 text-font-1">
        <div className="main-inner-wrapper py-3 items-center flex text-3xl leading-none">
          <IoCompassOutline />
          <h1 className="font-medium ml-1 text-lg">Explore</h1>
        </div>
      </header>
      <Posts />
    </main>
  );
}
