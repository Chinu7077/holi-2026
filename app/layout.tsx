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
  title: 'Holi With Chinu 2026 🎨',
  description: 'Celebrate Holi with colors, music & interactive magic by Chinu ✨',

  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },

  openGraph: {
    title: 'Holi With Chinu 2026 🎨',
    description: 'Celebrate Holi with colors, music & interactive magic by Chinu ✨',
    url: 'https://holiwithchinu.vercel.app/',
    siteName: 'Holi With Chinu',
    images: [
      {
        url: 'https://holiwithchinu.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Holi With Chinu 2026 🎨',
    description: 'Celebrate Holi with colors, music & interactive magic by Chinu ✨',
    images: ['https://holiwithchinu.vercel.app/og-image.jpg'],
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