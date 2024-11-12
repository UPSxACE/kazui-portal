import Link from "next/link";

const menu = [
  { label: "News", link: "#" },
  { label: "Community", link: "#" },
  { label: "Best Memes", link: "#" },
  { label: "Leaderboard", link: "#" },
  { label: "Stake", link: "#" },
];

export default function BigScreenMenu() {
  return (
    <nav className="ml-8 flex gap-6">
      {menu.map((x, i) => (
        <Link key={i} className="" href={x.link}>
          {x.label}
        </Link>
      ))}
    </nav>
  );
}
