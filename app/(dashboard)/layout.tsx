import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100/60 font-sans">
      {/* Left Sidebar */}
      <div className="p-4 pr-2 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Right Content with TopNav */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

