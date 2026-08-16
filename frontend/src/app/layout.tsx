import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DataMind — Local-First AI Data Analyst',
  description: 'Local-first AI analytics application that converts natural-language questions into reproducible, evidence-backed data analysis.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@500;600;700;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#080A0C] text-[#F5F7FA] antialiased selection:bg-[#8c80ff] selection:text-[#22008d]">
        {children}
      </body>
    </html>
  );
}
