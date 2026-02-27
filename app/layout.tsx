import type { Metadata, Viewport } from 'next'
import { Poppins, Dancing_Script } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans"
});

const dancingScript = Dancing_Script({ 
  subsets: ["latin"], 
  weight: ["400", "700"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: 'Happy Holi 2026 - Interactive Celebration',
  description: 'An immersive, interactive Holi celebration experience. Touch the colors and play Holi!',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${dancingScript.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}