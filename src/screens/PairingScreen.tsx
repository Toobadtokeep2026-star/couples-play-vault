import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { Vault } from '@/lib/types';
import { Link2, Copy, Check, Loader2, KeyRound, Users, ArrowRight, LogOut, Sparkles } from 'lucide-react';

function generatePairCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function PairingScreen() {
  const { profile, session, signOut, refreshProfile } = useAuth();
  const [vault, setVault] = useState<Vault | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadVault = useCallback(async () => {
    if (!profile?.vault_id) { setLoading(false); return; }
    const { data, error } = await supabase.from('vaults').select('*').eq('id', profile.vault_id).maybeSingle();
    if (error) console.error('Failed to load vault:', error.message);
    else setVault(data as Vault);
    setLoading(false);
  }, [profile?.vault_id]);

  useEffect(() => { loadVault(); }, [loadVault]);

  useEffect(() => {
    if (!vault || vault.partner_b_id) return;
    const channel = supabase.channel(`vault-${vault.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'vaults', filter: `id=eq.${vault.id}` }, (payload) => setVault(payload.new as Vault))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [vault?.id, vault?.partner_b_id]);

  async function handleCreateVault() {
    if (!session?.user?.id) return;
    setCreating(true); setError(null);
    try {
      const code = generatePairCode();
      const { data: vaultData, error: vaultError } = await supabase.from('vaults').insert({ pair_code: code, partner_a_id: session.user.id }).select('*').maybeSingle();
      if (vaultError) throw vaultError;
      if (!vaultData) throw new Error('Failed to create vault');
      const { error: profileError } = await supabase.from('profiles').update({ vault_id: vaultData.id }).eq('id', session.user.id);
      if (profileError) throw profileError;
      setVault(vaultData as Vault);
      await refreshProfile();
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to create vault'); }
    finally { setCreating(false); }
  }

  async function handleJoinVault() {
    if (!session?.user?.id || !joinCode.trim()) return;
    setJoining(true); setError(null);
    try {
      const code = joinCode.trim().toUpperCase();
      const { data: existingVault, error: findError } = await supabase.from('vaults').select('*').eq('pair_code', code).maybeSingle();
      if (findError) throw findError;
      if (!existingVault) throw new Error('No vault found with that code');
      if (existingVault.partner_b_id) throw new Error('That vault is already paired');
      if (existingVault.partner_a_id === session.user.id) throw new Error("You can't pair with yourself");
      const { error: updateError } = await supabase.from('vaults').update({ partner_b_id: session.user.id }).eq('id', existingVault.id);
      if (updateError) throw updateError;
      const { error: profileError } = await supabase.from('profiles').update({ vault_id: existingVault.id }).eq('id', session.user.id);
      if (profileError) throw profileError;
      await refreshProfile();
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to join vault'); }
    finally { setJoining(false); }
  }

  function copyCode() { if (!vault) return; navigator.clipboard.writeText(vault.pair_code); setCopied(true); setTimeout(() => setCopied(false), 2000); }

  if (loading) return (<div className="min-h-screen flex items-center justify-center bg-midnight-950"><Loader2 className="w-6 h-6 text-accent animate-spin" /></div>);
  const isPaired = vault?.partner_a_id && vault?.partner_b_id;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-8 bg-midnight-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative w-full max-w-md animate-slide-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-glow mb-4"><Link2 className="w-7 h-7 text-white" /></div>
          <h1 className="text-2xl font-bold tracking-tight">Link With Your Partner</h1>
          <p className="text-midnight-400 text-sm mt-1.5 text-center">{isPaired ? "You're connected!" : 'Create a vault and share the code, or enter your partner\'s code.'}</p>
        </div>
        {vault && !isPaired && (
          <div className="card p-6 shadow-card mb-5">
            <p className="text-xs font-medium text-midnight-400 mb-3 uppercase tracking-wide">Your Pairing Code</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-midnight-900 rounded-xl px-5 py-4 text-center"><span className="text-3xl font-bold tracking-[0.3em] text-accent">{vault.pair_code}</span></div>
              <button onClick={copyCode} className="btn-ghost px-4 py-4 flex items-center" title="Copy code">{copied ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}</button>
            </div>
            <p className="text-sm text-midnight-400 mt-4 leading-relaxed">Share this code with your partner. They'll enter it on their device to link your vaults. Waiting for them to join...</p>
            <div className="flex items-center justify-center gap-2 mt-4 text-accent-soft text-sm"><Loader2 className="w-4 h-4 animate-spin" /><span>Listening for your partner</span></div>
          </div>
        )}
        {vault && isPaired && (
          <div className="card p-8 shadow-card text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-success" /></div>
            <h2 className="text-xl font-bold mb-2">Vault Linked!</h2>
            <p className="text-midnight-400 text-sm mb-6">You and your partner are now connected. Your private vault is ready.</p>
            <div className="flex items-center justify-center gap-3 text-midnight-400"><Users className="w-5 h-5" /><span className="text-sm">2 partners connected</span></div>
          </div>
        )}
        {!vault && (
          <>
            <div className="card p-6 shadow-card mb-5">
              <div className="flex items-start gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0"><KeyRound className="w-5 h-5 text-accent" /></div><div><h3 className="font-semibold mb-0.5">Create a New Vault</h3><p className="text-sm text-midnight-400">Generate a code and share it with your partner.</p></div></div>
              <button onClick={handleCreateVault} disabled={creating} className="btn-primary w-full flex items-center justify-center gap-2">{creating ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</> : <><Sparkles className="w-4 h-4" />Create Vault</>}</button>
            </div>
            <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-midnight-600" /><span className="text-xs text-midnight-400 uppercase tracking-wide">or</span><div className="flex-1 h-px bg-midnight-600" /></div>
            <div className="card p-6 shadow-card">
              <div className="flex items-start gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0"><Link2 className="w-5 h-5 text-accent" /></div><div><h3 className="font-semibold mb-0.5">Join With a Code</h3><p className="text-sm text-midnight-400">Enter the code your partner shared with you.</p></div></div>
              <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="ENTER CODE" maxLength={6} className="input-field text-center text-lg tracking-[0.3em] font-bold mb-3" />
              <button onClick={handleJoinVault} disabled={joining || joinCode.length < 6} className="btn-ghost w-full flex items-center justify-center gap-2">{joining ? <><Loader2 className="w-4 h-4 animate-spin" />Joining...</> : <>Join Vault<ArrowRight className="w-4 h-4" /></>}</button>
            </div>
          </>
        )}
        {error && <div className="text-sm text-error bg-error/10 border border-error/20 rounded-xl px-4 py-3 mt-4">{error}</div>}
        <button onClick={signOut} className="mt-6 mx-auto flex items-center gap-2 text-sm text-midnight-400 hover:text-white transition-colors"><LogOut className="w-4 h-4" />Sign out</button>
      </div>
    </div>
  );
}