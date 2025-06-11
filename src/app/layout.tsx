import CustomThemeProvider from "@/theme/ThemeProvider";
import "./globals.css";
import Providers from "@/context/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CustomThemeProvider>
            <Providers>
              {children}
            </Providers>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
  