import Header from "@/components/layout/header";
import { ThemeProvider } from "@/components/layout/theme-provider";
import SocketProvider from "@/components/socket/socket-provider";
import { SolanaProvider } from "@/components/solana/solana-provider";
import { AppStateProvider } from "@/components/wallet/app-state";
import { jwtVerify } from "Jose";
import { cookies } from "next/headers";
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const jwt = cookieStore.get("authToken")?.value;
  const payload = jwt
    ? await jwtVerify<{ address: string }>(
        jwt,
        new TextEncoder().encode(process.env.JWT_SECRET ?? "")
      )
    : null;
  const initialAddress = payload?.payload?.address;

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <ThemeProvider
          attribute="class"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <SolanaProvider autoconnect={Boolean(payload?.payload?.address)}>
              <AppStateProvider initialAddress={initialAddress}>
                <SocketProvider>
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
                </SocketProvider>
              </AppStateProvider>
            </SolanaProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
