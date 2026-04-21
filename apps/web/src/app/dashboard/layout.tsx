import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — StrokeSync',
  description: 'Neurologist consultation dashboard for real-time stroke care coordination.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {children}
    </div>
  );
}
