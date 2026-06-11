import { Link } from 'react-router-dom';

export default function SubmitClaim() {
  return (
    <main className="max-w-screen-2xl mx-auto px-12 py-24 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-surface-container-low p-12 rounded-3xl flex flex-col items-center border border-outline-variant/30 text-center shadow-sm max-w-3xl">
        <span className="material-symbols-outlined text-primary mb-6 text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>note_add</span>
        <h1 className="font-headline text-4xl font-extrabold text-primary mb-6 tracking-tight">Submit Claim Flow</h1>
        <p className="text-lg text-on-surface-variant mb-10 max-w-xl">
          The digital claim submission portal is currently awaiting custom design logic from the next sprint. Until then, you can monitor your active claims.
        </p>
        <Link to="/claims" className="bg-primary text-white font-bold py-4 px-10 rounded-xl hover:bg-primary-container transition-colors shadow-md">
          View My Claims
        </Link>
      </div>
    </main>
  );
}
