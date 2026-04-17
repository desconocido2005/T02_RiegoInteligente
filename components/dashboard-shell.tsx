import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
        <TopBar />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-12 py-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
