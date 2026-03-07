type Clause = {
  id: string;
  text: string;
};

type ResolutionSidebarProps = {
  workingPaperTitle: string;
  preambulatory: Clause[];
  operative: Clause[];
  onProposeAmendment?: () => void;
  onRequestSponsorship?: () => void;
  onSubmitDraft?: () => void;
};

export function ResolutionSidebar({
  workingPaperTitle,
  preambulatory,
  operative,
  onProposeAmendment,
  onRequestSponsorship,
  onSubmitDraft,
}: ResolutionSidebarProps) {
  return (
    <aside className="sidebar sidebar-right" aria-label="Resolution drafter">
      <h2 className="panel-title">Resolution Drafter</h2>

      <section className="resolution-card">
        <header className="resolution-header">
          <div>
            <div className="resolution-title">{workingPaperTitle}</div>
            <div className="resolution-meta">Live working paper</div>
          </div>
          <span className="chip chip-compact">Drafting</span>
        </header>

        <div className="resolution-section">
          <div className="section-label">Preambulatory Clauses</div>
          <ul className="clause-list">
            {preambulatory.map((clause) => (
              <li key={clause.id} className="animate-clause">
                {clause.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="resolution-section">
          <div className="section-label">Operative Clauses</div>
          <ol className="clause-list numbered">
            {operative.map((clause) => (
              <li key={clause.id} className="animate-clause">
                {clause.text}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-3 space-y-2">
          <button
            type="button"
            className="btn btn-secondary btn-full"
            onClick={onProposeAmendment}
            title="Draft a change to a specific clause."
          >
            Propose Amendment
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-full"
            onClick={onRequestSponsorship}
            title="Ask other delegations to co-sponsor this paper."
          >
            Request Sponsorship
          </button>
          <button
            type="button"
            className="btn btn-primary btn-full"
            onClick={onSubmitDraft}
            title="Submit this document as a draft resolution for consideration."
          >
            Submit Draft Resolution
          </button>
        </div>
      </section>
    </aside>
  );
}

