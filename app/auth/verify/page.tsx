type AuthVerifyPageProps = {
  searchParams: Promise<{
    email?: string;
    next?: string;
    error?: string;
    claimSlug?: string;
    claimToken?: string;
  }>;
};

export default async function AuthVerifyPage({ searchParams }: AuthVerifyPageProps) {
  const params = await searchParams;

  return (
    <main className="auth-page stack">
      <div className="section-head">
        <h1>verify</h1>
        <p>enter the code from your email.</p>
      </div>

      {params.error ? <p className="error">{params.error}</p> : null}

      <form action="/api/auth/verify-code" className="stack" method="post">
        <input name="email" readOnly required type="email" value={params.email ?? ""} />
        <input name="code" inputMode="numeric" pattern="[0-9]{6}" placeholder="123456" required />
        <input name="next" type="hidden" value={params.next ?? "/dashboard/sites"} />
        <input name="claimSlug" type="hidden" value={params.claimSlug ?? ""} />
        <input name="claimToken" type="hidden" value={params.claimToken ?? ""} />
        <button className="button" type="submit">
          continue
        </button>
      </form>
    </main>
  );
}
