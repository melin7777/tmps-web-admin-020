import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css'
import { Inter } from 'next/font/google'
import AuthProvider from '@/providers/AuthProvider';
import CssBaseline from '@mui/material/CssBaseline';
import DateProvider from '@/providers/DateProvider';
import CustomThemeProvider from '@/providers/CustomThemeProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TechMax - Admin',
  description: 'Seller app for TechMax (Pvt) Ltd.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CssBaseline/>
        <CustomThemeProvider>
          <AuthProvider>
            <DateProvider>
              {children}
            </DateProvider>
          </AuthProvider>
        </CustomThemeProvider>
      </body>
    </html>
  )
}
