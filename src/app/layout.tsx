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
              <div className="flex flex-col items-center bg-background-secondary">
                <Header />
                <div className=" max-w-[112.5rem] flex w-full">
                  {/* <aside className="w-60 xl:w-72 shrink-0 bg-background border-r border-solid border-border hidden sm:block"></aside> */}
                  <div className="w-full flex flex-col items-center h-landing gradient-1 px-4">
                    {children}
                  </div>
                  {/* <aside className="w-60 xl:w-72 shrink-0 bg-background border-l border-solid border-border hidden 2md:block"></aside> */}
                </div>
              </div>
            </SolanaProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
