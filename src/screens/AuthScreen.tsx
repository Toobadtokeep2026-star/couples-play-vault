import { useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, User, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';

type Mode = 'signin' | 'signup';

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            display_name: displayName || 'Anonymous',
          });
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-8 bg-midnight-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-sm animate-slide-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-glow mb-4">
            <Lock className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Couples Play Vault</h1>
          <p className="text-midnight-400 text-sm mt-1.5 text-center">
            Private. Synced. Just for two.
          </p>
        </div>

        <div className="card p-6 shadow-card">
          <div className="flex gap-1 mb-6 bg-midnight-900 rounded-xl p-1">
            <button onClick={() => setMode('signin')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'signin' ? 'bg-accent text-white shadow-glow' : 'text-midnight-400 hover:text-white'}`}>Sign In</button>
            <button onClick={() => setMode('signup')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'signup' ? 'bg-accent text-white shadow-glow' : 'text-midnight-400 hover:text-white'}`}>Create Account</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-midnight-400 mb-1.5 uppercase tracking-wide">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-400" />
                  <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="What should your partner call you?" className="input-field pl-11" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-midnight-400 mb-1.5 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-400" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field pl-11" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-midnight-400 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-400" />
                <input type={showPassword ? 'text' : 'password'} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="input-field pl-11 pr-11" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-midnight-400 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-error bg-error/10 border border-error/20 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />{mode === 'signup' ? 'Creating account...' : 'Signing in...'}</>
              ) : (
                <><Sparkles className="w-4 h-4" />{mode === 'signup' ? 'Create Account' : 'Enter Vault'}</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-midnight-400 mt-6 leading-relaxed">
          Your vault is end-to-end private. No one can see what happens inside except you and your partner.
        </p>
      </div>
    </div>
  );
}