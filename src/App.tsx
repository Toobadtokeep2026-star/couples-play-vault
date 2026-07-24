import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import AuthScreen from '@/screens/AuthScreen';
import AgeGate from '@/screens/AgeGate';
import PairingScreen from '@/screens/PairingScreen';
import GameHub from '@/screens/GameHub';
import PlayInterface from '@/screens/PlayInterface';
import MediaGallery from '@/screens/MediaGallery';
import RoleplayGenerator from '@/screens/RoleplayGenerator';
import ImageEditor from '@/screens/ImageEditor';
import type { Game } from '@/lib/types';
import { Loader2, Lock } from 'lucide-react';

type View =
  | { name: 'hub' }
  | { name: 'play'; game: Game }
  | { name: 'media' }
  | { name: 'roleplay' }
  | { name: 'editor' };

function AppContent() {
  const { session, profile, loading } = useAuth();
  const [view, setView] = useState<View>({ name: 'hub' });
  const [ageVerified, setAgeVerified] = useState(() => {
    return sessionStorage.getItem('age-verified') === 'true';
  });

  useEffect(() => {
    setView({ name: 'hub' });
  }, [profile?.id]);

  function handleAgeConfirm() {
    sessionStorage.setItem('age-verified', 'true');
    setAgeVerified(true);
  }

  if (!ageVerified) return <AgeGate onConfirm={handleAgeConfirm} />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-glow">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <Loader2 className="w-5 h-5 text-accent animate-spin" />
        </div>
      </div>
    );
  }

  if (!session) return <AuthScreen />;
  if (!profile?.vault_id) return <PairingScreen />;

  if (view.name === 'play' && view.game) {
    return <PlayInterface game={view.game} onBack={() => setView({ name: 'hub' })} />;
  }
  if (view.name === 'media') return <MediaGallery onBack={() => setView({ name: 'hub' })} />;
  if (view.name === 'roleplay') return <RoleplayGenerator onBack={() => setView({ name: 'hub' })} />;
  if (view.name === 'editor') return <ImageEditor onBack={() => setView({ name: 'hub' })} />;

  return (
    <GameHub
      onSelectGame={(game) => setView({ name: 'play', game })}
      onOpenMedia={() => setView({ name: 'media' })}
      onOpenRoleplay={() => setView({ name: 'roleplay' })}
      onOpenEditor={() => setView({ name: 'editor' })}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}