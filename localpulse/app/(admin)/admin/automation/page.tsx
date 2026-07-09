export default function AutomationPage() {
  return (
    <section className="rounded-xl border border-lp-border bg-lp-surface p-8">
      <p className="text-sm font-bold uppercase tracking-widest text-lp-accent2">Phase 3</p>
      <h1 className="mt-2 font-heading text-3xl font-bold text-lp-text">Automation Rules</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-lp-text2">
        Global seasonal, local-event, reply, and review-to-post rules will be configured here once
        the ingestion pipeline is active.
      </p>
    </section>
  );
}
