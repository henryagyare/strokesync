import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StrokeSync — Remote Neurologist Consultation',
  description: 'HIPAA-compliant Mobile Stroke Unit + Remote Neurologist Consultation System for real-time stroke care coordination.',
  keywords: ['stroke', 'neurology', 'telemedicine', 'MSU', 'tPA', 'NIHSS', 'consultation'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
