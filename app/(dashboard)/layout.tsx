import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100/50">
      <div className="p-5">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
