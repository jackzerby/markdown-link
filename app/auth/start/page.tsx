type AuthStartPageProps = {
  searchParams: Promise<{
    claimSlug?: string;
    claimToken?: string;
    next?: string;
    message?: string;
    debugCode?: string;
  }>;
};

export default async function AuthStartPage({ searchParams }: AuthStartPageProps) {
  const params = await searchParams;

  return (
    <main className="auth-page stack">
      <div className="section-head">
        <h1>sign in</h1>
        <p>enter your email. we will send a code.</p>
      </div>

      {params.message ? <p>{params.message}</p> : null}
      {params.debugCode ? <p>dev code: {params.debugCode}</p> : null}

      <form action="/api/auth/request-code" className="stack" method="post">
        <input name="email" placeholder="you@example.com" required type="email" />
        <input name="next" type="hidden" value={params.next ?? "/dashboard/sites"} />
        <input name="claimSlug" type="hidden" value={params.claimSlug ?? ""} />
        <input name="claimToken" type="hidden" value={params.claimToken ?? ""} />
        <button className="button" type="submit">
          send code
        </button>
      </form>
    </main>
  );
}
