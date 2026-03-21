import Link from "next/link";

const items = [
  { href: "/dashboard/sites", label: "Sites" },
  { href: "/dashboard/handle", label: "Handle" },
  { href: "/dashboard/domains", label: "Domains" },
  { href: "/dashboard/api-key", label: "API key" },
  { href: "/dashboard/plan", label: "Plan" },
  { href: "/dashboard/support", label: "Support" },
];

export function DashboardNav() {
  return (
    <aside className="dashboard-nav">
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
