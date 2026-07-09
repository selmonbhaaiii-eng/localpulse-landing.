import { ClientSidebar } from "@/components/dashboard/ClientSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-lp-bg text-lp-text">
      <ClientSidebar />
      <div className="ml-[220px] min-h-screen">
        <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-lp-border bg-lp-bg/90 px-6 backdrop-blur-xl">
          <p className="text-[11px] font-bold uppercase tracking-widest text-lp-text3">
            Business Dashboard
          </p>
          <div className="rounded-full border border-lp-border bg-lp-surface px-3 py-1 text-xs font-medium text-lp-text2">
            GBP not connected
          </div>
        </header>
        <main className="px-6 py-7">{children}</main>
      </div>
    </div>
  );
}
