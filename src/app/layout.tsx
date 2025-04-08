import { Navbar } from '@/components/navbar/navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Footer } from '@/components/footer/footer'
import { dmSans } from '@/components/fonts/dmSans'

export const metadata: Metadata = {
  title: 'DaurTani - Solusi Daur Ulang Limbah Pertanian',
  description: 'Platform marketplace dan komunitas untuk daur ulang limbah pertanian berkelanjutan',
  verification: {
    google: "BdfghLWZfCIxNl4X6PcZi-S5sNLuhijwfQgY_Ui8agA"
  },
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['apple-touch-icon.png']
  }
} as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${dmSans.className} bg-neutral01 overflow-x-hidden`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}