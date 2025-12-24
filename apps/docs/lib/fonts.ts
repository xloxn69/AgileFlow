import {
  Geist_Mono as FontMono,
  Geist as FontSans,
  Inter,
  Source_Serif_4,
  JetBrains_Mono,
} from "next/font/google"

import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
})

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

// Serif font for headings (similar to Anthropic Serif Display)
const fontSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

// Monospace font for code (same as Claude Code docs)
const fontJetBrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700"],
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontInter.variable,
  fontSerif.variable,
  fontJetBrains.variable
)
