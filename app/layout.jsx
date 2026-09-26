import { Outfit, Fraunces } from 'next/font/google';
import Script from 'next/script';
import { cookies } from 'next/headers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';
import { GlobalProvider } from '@/context/GlobalContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { DeskProvider } from '@/context/DeskContext';
import MarketTape from '@/components/MarketTape';
import CompareDock from '@/components/catalog/CompareDock';
import { ThemeHud } from '@/components/ThemeControls';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/assets/styles/globals.css';
import 'photoswipe/dist/photoswipe.css';
import { isTheme } from '@/lib/themes';

const sans = Outfit({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const serif = Fraunces({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export const metadata = {
  title: 'Aura & Apex Capital',
  description: 'Spatial Architecture. Algorithmic Real Estate. Curated Living.',
  keywords: 'fictional real estate, spatial architecture, curated living',
};

function authReady() {
  const secret = process.env.NEXTAUTH_SECRET || '';
  const google = process.env.GOOGLE_CLIENT_ID || '';
  if (!secret || !google) return false;
  if (secret.includes('ADD_YOUR_OWN') || google.includes('ADD_YOUR_OWN')) return false;
  return true;
}

const MainLayout = ({ children }) => {
  const stored = cookies().get('aac-theme')?.value;
  const theme = isTheme(stored) ? stored : 'midnight';
  const enabled = authReady();

  return (
    <html lang="en" data-theme={theme} className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <body>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <AuthProvider enabled={enabled}>
          <GlobalProvider enabled={enabled}>
            <ThemeProvider initialTheme={theme}>
              <DeskProvider>
                <Navbar />
                <MarketTape />
                <main className="pb-28">{children}</main>
                <Footer />
                <CompareDock />
                <ThemeHud />
                <ToastContainer />
              </DeskProvider>
            </ThemeProvider>
          </GlobalProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default MainLayout;
