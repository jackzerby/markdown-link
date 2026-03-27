import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { relativeDate } from "@/lib/utils";

export default async function DashboardSupportPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requireUser();
  const params = searchParams ? await searchParams : {};
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const success = Array.isArray(params.success) ? params.success[0] : params.success;
  const requests = await db.supportRequest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <section className="support-view">
      <style>{`
        .support-view {
          width: min(960px, calc(100vw - 32px));
          margin: 0 auto;
          padding: 28px 0 72px;
          display: grid;
          gap: 24px;
        }

        .support-view form {
          display: grid;
          gap: 12px;
          padding: 18px;
          border-radius: 8px;
          background: var(--surface);
        }

        .support-view input,
        .support-view textarea {
          border-radius: 6px;
          border: 1px solid var(--line-strong);
        }

        .support-view textarea {
          min-height: 180px;
        }

        .support-view .button {
          border: 0;
          border-radius: 6px;
          align-self: start;
        }

        .support-view .list {
          gap: 0;
        }

        .support-view .site-card {
          border: 0;
          border-top: 1px solid var(--line);
          background: transparent;
          padding: 16px 0;
        }

        .support-view .site-card:first-child {
          border-top: 0;
        }

        @media (max-width: 820px) {
          .support-view {
            width: calc(100vw - 24px);
            padding: 20px 0 56px;
          }
        }
      `}</style>

      <div className="section-head">
        <h1>Support</h1>
        <p>Questions or issues? We're here to help.</p>
      </div>

      {error ? <p className="error">{error}</p> : null}
      {success ? <p>{success}</p> : null}

      <form action="/api/dashboard/support" className="stack" method="post">
        <input name="subject" placeholder="What's this about?" required />
        <textarea name="message" placeholder="Describe what happened..." required />
        <button className="button" type="submit">
          Send message
        </button>
      </form>

      <div className="list">
        {requests.length === 0 ? <div className="empty-state"><p>No messages yet.</p></div> : null}
        {requests.map((request) => (
          <div key={request.id} className="site-card stack">
            <p>{request.subject}</p>
            <p className="muted">
              {request.status.toLowerCase()} · {relativeDate(request.createdAt)}
            </p>
            <p className="muted">{request.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
