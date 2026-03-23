import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function DashboardHandlePage() {
  const user = await requireUser();
  const handles = await db.handle.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="stack">
      <div className="section-head">
        <h1>handle</h1>
        <p>claim a simple subdomain.</p>
      </div>

      <form action="/api/dashboard/handle" className="stack" method="post">
        <input name="slug" placeholder="handle" required />
        <button className="button" type="submit">
          claim
        </button>
      </form>

      <div className="list">
        {handles.length === 0 ? <p>no handles yet.</p> : null}
        {handles.map((handle) => (
          <div key={handle.id} className="list-row">
            <span>{handle.slug}.mdshare.link</span>
            <span>{handle.isPrimary ? "primary" : "secondary"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
