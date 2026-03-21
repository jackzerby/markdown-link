import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function DashboardSupportPage() {
  const user = await requireUser();
  const requests = await db.supportRequest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <section className="stack">
      <div className="section-head">
        <h1>support</h1>
        <p>send a note to support.</p>
      </div>

      <form action="/api/dashboard/support" className="stack" method="post">
        <input name="subject" placeholder="subject" required />
        <textarea name="message" placeholder="message" required />
        <button className="button" type="submit">
          send
        </button>
      </form>

      <div className="list">
        {requests.length === 0 ? <p>no support messages yet.</p> : null}
        {requests.map((request) => (
          <div key={request.id} className="site-card stack">
            <p>{request.subject}</p>
            <p className="muted">{request.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
