import { redirect } from "next/navigation";

export default function DashboardHandlePage() {
  redirect("/dashboard/sites?error=Subdomain%20handles%20are%20no%20longer%20available.");
}
