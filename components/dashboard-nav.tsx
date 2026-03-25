"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const items = [
  { href: "/dashboard/sites", label: "Links" },
  { href: "/dashboard/api-key", label: "API key" },
  { href: "/dashboard/plan", label: "Plan" },
  { href: "/dashboard/support", label: "Support" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="dashboard-nav">
      <p className="dashboard-nav-label">Dashboard</p>
      {items.map((item) => (
        <Link
          key={item.href}
          className={clsx(
            pathname === item.href || pathname.startsWith(`${item.href}/`) ? "is-active" : undefined,
          )}
          href={item.href}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
