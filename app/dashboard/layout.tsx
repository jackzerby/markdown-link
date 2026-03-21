import Link from "next/link";

import { DashboardNav } from "@/components/dashboard-nav";
import { requireUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="dashboard-shell">
      <DashboardNav />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p>markdown.link</p>
            <p className="muted">{user.email}</p>
          </div>
          <Link href="/">home</Link>
        </header>
        {children}
      </main>
    </div>
  );
}
