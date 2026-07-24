import { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

export default function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-8 bg-midnight-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-sm animate-slide-up text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-glow mx-auto mb-6">
          <Lock className="w-8 h-8 text-white" strokeWidth={2} />
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-2">Couples Play Vault</h1>
        <p className="text-midnight-400 text-sm mb-8 leading-relaxed">
          A private intimate space for two. Adult content ahead.
        </p>

        <div className="card p-6 shadow-card">
          <div className="flex items-start gap-3 mb-5 text-left">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold mb-0.5">18+ Only</h3>
              <p className="text-sm text-midnight-400 leading-relaxed">
                This app contains explicit adult content. You must be 18 or older to continue.
              </p>
            </div>
          </div>

          <button
            onClick={() => setChecked(true)}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all mb-4 ${
              checked
                ? 'border-accent bg-accent/10'
                : 'border-midnight-600 bg-midnight-800 hover:border-midnight-500'
            }`
          >
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                checked ? 'border-accent bg-accent' : 'border-midnight-500'
              }`}
            >
              {checked && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-sm text-white/90 text-left leading-relaxed">
              I confirm I am 18 years of age or older
            </span>
          </button>

          <button
            onClick={onConfirm}
            disabled={!checked}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            Enter
          </button>
        </div>

        <p className="text-center text-xs text-midnight-400 mt-6 leading-relaxed">
          By entering, you agree that this content is for private use between consenting adults.
        </p>
      </div>
    </div>
  );
}