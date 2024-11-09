import { SolanaProvider } from "@/components/_/solana/solana-provider";
import Header from "@/components/layout/header";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";
import { ReactQueryProvider } from "./react-query-provider";

// const font = Montserrat({
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
// });
// const font = Open_Sans({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700", "800"],
// });

export const metadata = {
  title: "Kazui Portal",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <SolanaProvider>
              <div className="flex justify-center bg-background">
                <div className="max-w-[1800px] flex w-full">
                  <aside className="w-60 xl:w-72 shrink-0 bg-background border-r border-solid border-zinc-500/40 hidden sm:block"></aside>
                  <div className="w-full flex flex-col items-center h-svh gradient-1">
                    <Header />
                    {children}
                  </div>
                  <aside className="w-60 xl:w-72 shrink-0 bg-background border-l border-solid border-zinc-500/40 hidden 2md:block"></aside>
                </div>
              </div>
            </SolanaProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
