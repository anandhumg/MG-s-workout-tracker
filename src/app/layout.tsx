// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './provider';
import BottomNav from '@/components/BottomNav';
import ClientLayout from './clientLayout'; // 👈 import new client component

export const metadata: Metadata = {
  title: "MG's Workout Tracker",
  description: 'A Tool to track your workouts efficiently.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
