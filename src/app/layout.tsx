import type { Metadata } from 'next';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import './globals.css';
import { LessonProvider } from '@/lib/lessonContext';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
});

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  variable: '--font-dm-serif',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DSST — Math Teacher Tools',
  description: 'Lesson-specific guidance for math teachers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerifDisplay.variable} h-full`}>
      <body className="min-h-full bg-surface text-ink">
        <LessonProvider>{children}</LessonProvider>
      </body>
    </html>
  );
}
