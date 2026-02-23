import React, { useState, useEffect } from 'react';
import { db, LocalUserMistake } from '@/db/localDb';
import { useAuth } from '@/hooks/useAuth';
import { RotateCcw, CheckCircle2, AlertCircle, Play } from 'lucide-react';
import { toast } from 'sonner';

const MistakeWorkout: React.FC = () => {
  const { user } = useAuth();
  const [mistakes, setMistakes] = useState<LocalUserMistake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMistakes();
    }
  }, [user]);

  const loadMistakes = async () => {
    setLoading(true);
    if (!user) return;
    try {
      const localMistakes = await db.userMistakes
        .where('user_id')
        .equals(user.id)
        .and(m => !m.resolved)
        .toArray();
      setMistakes(localMistakes);
    } catch (error) {
      console.error('Error loading mistakes:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveMistake = async (id: string) => {
    try {
      await db.userMistakes.update(id, { resolved: true, synced: 0 });
      setMistakes(prev => prev.filter(m => m.id !== id));
      toast.success('Mistake resolved! Good job.');
    } catch (error) {
      console.error('Error resolving mistake:', error);
    }
  };

  if (loading) return <div className="text-center p-8">Loading mistakes...</div>;

  if (mistakes.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Clear Skies!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          You don't have any outstanding mistakes to work out. Keep up the great work!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {mistakes.map((mistake) => (
          <div key={mistake.id} className="glass-panel p-6 rounded-2xl border-l-4 border-l-destructive">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Attempted on {new Date(mistake.attempted_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="bg-background/50 rounded-lg p-4 font-mono text-sm mb-4 overflow-x-auto">
                  <code className="text-destructive">{mistake.wrong_code}</code>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Identify what went wrong and try to fix it in the original challenge.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => mistake.id && resolveMistake(mistake.id)}
                    className="px-4 py-2 bg-success/20 text-success rounded-xl text-sm font-medium hover:bg-success/30 transition-colors"
                  >
                    Mark as Resolved
                  </button>
                  <button className="px-4 py-2 bg-secondary text-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2">
                    <Play className="w-3 h-3" /> Retry Challenge
                  </button>
                </div>
              </div>
              <div className="p-3 bg-destructive/10 rounded-full">
                <RotateCcw className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MistakeWorkout;
