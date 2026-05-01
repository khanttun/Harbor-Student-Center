import type { Metadata } from 'next'
import { Poppins, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ScrollToTopButton } from '@/components/scroll-to-top-button'
import './globals.css'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: 'The Harbor Student Center | Mae Fah Luang University',
  description: 'A home away from home for Myanmar students at Mae Fah Luang University. Free food, events, and a welcoming community.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} font-sans antialiased`}>
        {children}
        <ScrollToTopButton />
        <Analytics />
      </body>
    </html>
  )
}
