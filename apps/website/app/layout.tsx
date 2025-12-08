import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgileFlow - AI-Driven Agile Development",
  description: "41 commands, 26 agents, 23 skills for Claude Code, Cursor, and Windsurf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
