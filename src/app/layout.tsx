import StyledComponentsRegistry from "@/lib/StyledRegistry";
import Providers from "./providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog SSR",
  description: "Test task blog with SSR, Redux, SWR, Zod",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
