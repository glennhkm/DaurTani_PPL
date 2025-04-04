import { Navbar } from '@/components/navbar/navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Footer } from '@/components/footer/footer'
import { dmSans } from '@/components/fonts/dmSans'

export const metadata: Metadata = {
  title: 'DaurTani - Solusi Daur Ulang Limbah Pertanian',
  description: 'Platform marketplace dan komunitas untuk daur ulang limbah pertanian berkelanjutan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${dmSans.className} bg-neutral01`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}