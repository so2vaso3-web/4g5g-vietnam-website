import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mạng Việt Nam - Bán gói cước 4G/5G",
  description: "Bán gói cước 4G/5G từ 9 nhà mạng Việt Nam: Viettel, Vinaphone, MobiFone, Vietnamobile, Gmobile, iTel, Wintel, VNSKY, Local",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark" style={{ backgroundColor: '#0f172a', background: '#0f172a' }}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <style dangerouslySetInnerHTML={{__html: `
          * { background-color: inherit !important; }
          html, body, main, section, header, footer, div, #__next, [role="main"] { 
            background: #0f172a !important; 
            background-color: #0f172a !important; 
            color: #f1f5f9 !important;
          }
          section[id], section[class] { 
            background: #0f172a !important; 
            background-color: #0f172a !important; 
          }
        `}} />
      </head>
      <body className="antialiased bg-slate-900 text-gray-100" style={{ backgroundColor: '#0f172a', background: '#0f172a', color: '#f1f5f9' }}>
        {children}
      </body>
    </html>
  );
}

