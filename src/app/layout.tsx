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
              <Header />
              {children}
            </SolanaProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
