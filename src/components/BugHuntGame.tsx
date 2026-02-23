import React, { useState, useEffect } from 'react';
import { db, LocalBugChallenge } from '@/db/localDb';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Bug, CheckCircle2, XCircle, Play, Trophy, ArrowRight, RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import CodeEditor from './CodeEditor';
import { toast } from 'sonner';

interface BugHuntGameProps {
  language: string;
}

const BugHuntGame: React.FC<BugHuntGameProps> = ({ language }) => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<LocalBugChallenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number | null>(null);
  const [code, setCode] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [aiDiagnostic, setAiDiagnostic] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<'listing' | 'playing' | 'result'>('listing');

  useEffect(() => {
    loadChallenges();
  }, [language]);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      // Try local first
      const localChallenges = await db.bugChallenges.where('language').equals(language).toArray();

      if (localChallenges.length > 0) {
        setChallenges(localChallenges);
      } else {
        // Fetch from Supabase
        try {
          const { data, error } = await supabase
            .from('bug_challenges')
            .select('*')
            .eq('language', language);

          if (data && data.length > 0) {
            setChallenges(data as LocalBugChallenge[]);
            await db.bugChallenges.bulkPut(data);
          } else {
            throw new Error('No data or error');
          }
        } catch (supabaseError) {
          console.warn('Supabase fetch failed, using fallback:', supabaseError);
          // Fallback data for demonstration/offline
          const fallbacks: LocalBugChallenge[] = [
            {
              id: 'fallback-1',
              title: 'Syntax Safari',
              description: `Fix the syntax error in this ${language} snippet.`,
              broken_code: language === 'jaclang' ? 'walker greet { can visit { print("Hello" } }' : 'print "Hello"',
              solution_code: language === 'jaclang' ? 'walker greet { can visit { print("Hello"); } }' : 'print("Hello")',
              language: language,
              difficulty: 'Easy',
              xp_reward: 30
            }
          ];
          setChallenges(fallbacks);
        }
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const startChallenge = (index: number) => {
    setCurrentChallengeIndex(index);
    setCode(challenges[index].broken_code);
    setIsCorrect(null);
    setAiDiagnostic(null);
    setGameState('playing');
  };

  const checkSolution = async () => {
    if (currentChallengeIndex === null) return;

    const challenge = challenges[currentChallengeIndex];
    const normalizedSolution = challenge.solution_code.replace(/\s+/g, ' ').trim();
    const normalizedUserCode = code.replace(/\s+/g, ' ').trim();

    const correct = normalizedUserCode === normalizedSolution;
    setIsCorrect(correct);
    setAiDiagnostic(null);

    if (correct) {
      toast.success(`Bug fixed! +${challenge.xp_reward} XP`);

      // Update XP in DB
      if (user) {
        await supabase.rpc('award_xp', {
          u_id: user.id,
          xp_amount: challenge.xp_reward
        });
      }
      setGameState('result');
    } else {
      toast.error('Not quite! The bug is still there.');

      // Log mistake
      if (user) {
        await db.userMistakes.add({
          user_id: user.id,
          bug_challenge_id: challenge.id,
          wrong_code: code,
          attempted_at: new Date().toISOString(),
          resolved: false,
          synced: 0
        });
      }
    }
  };

  const getAiHelp = async () => {
    if (currentChallengeIndex === null || isAiLoading) return;
    setIsAiLoading(true);

    try {
      const challenge = challenges[currentChallengeIndex];
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/jaclang-tutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `I'm trying to fix a bug in this ${language} code.
              The challenge is: "${challenge.title}: ${challenge.description}".
              The broken code was: \`${challenge.broken_code}\`.
              My current attempt is: \`${code}\`.
              It's still not correct. Can you explain why my code is still wrong and give me a hint without giving the full solution?`
            }
          ],
          language: language
        })
      });

      if (!response.ok) throw new Error('AI request failed');

      // We'll just read the first chunk for the diagnostic to keep it simple,
      // or we could implement streaming here too. For a diagnostic, a single non-streamed response
      // is often easier if we adjust the edge function, but since it's a streaming function...

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) fullText += content;
              } catch (e) {}
            }
          }
        }
      }

      setAiDiagnostic(fullText);
    } catch (error) {
      console.error('AI Diagnostic error:', error);
      toast.error('Failed to get AI hint');
    } finally {
      setIsAiLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12">Loading challenges...</div>;
  }

  if (gameState === 'listing') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.length === 0 ? (
          <div className="col-span-full text-center p-12 glass-panel rounded-2xl">
            <Bug className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No bug challenges available for {language} yet.</p>
          </div>
        ) : (
          challenges.map((challenge, i) => (
            <div key={challenge.id} className="glass-panel p-6 rounded-2xl flex flex-col h-full hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <Bug className="w-6 h-6 text-destructive" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  challenge.difficulty === 'Easy' ? 'bg-success/10 text-success' :
                  challenge.difficulty === 'Medium' ? 'bg-warning/10 text-warning' :
                  'bg-destructive/10 text-destructive'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{challenge.title}</h3>
              <p className="text-muted-foreground text-sm mb-6 flex-grow">{challenge.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm font-medium text-primary">+{challenge.xp_reward} XP</span>
                <button
                  onClick={() => startChallenge(i)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  Hunt Bug <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  if (gameState === 'playing' && currentChallengeIndex !== null) {
    const challenge = challenges[currentChallengeIndex];
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setGameState('listing')}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Games
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium px-3 py-1 bg-secondary rounded-full">
              Target: {challenge.language}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Bug className="w-6 h-6 text-destructive" />
                {challenge.title}
              </h2>
              <p className="text-muted-foreground mb-4">{challenge.description}</p>

              <div className="relative">
                <CodeEditor
                  initialCode={code}
                  initialLanguage={challenge.language}
                  onChange={setCode}
                />
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setCode(challenge.broken_code)}
                  className="px-6 py-2 border border-input rounded-xl text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
                <button
                  onClick={checkSolution}
                  className="px-8 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" /> Run Fix
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Diagnostic Output</h3>
              <div className="bg-background/50 rounded-xl p-4 font-mono text-sm min-h-[150px]">
                {isCorrect === null ? (
                  <p className="text-muted-foreground italic">Waiting for fix execution...</p>
                ) : isCorrect ? (
                  <p className="text-success flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Solution verified! Code is now stable.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-destructive flex items-center gap-2 font-bold">
                        <XCircle className="w-4 h-4" /> Fix Unsuccessful
                      </p>
                      <p className="text-muted-foreground text-xs">
                        The code still contains bugs or doesn't match the expected output.
                      </p>
                    </div>

                    {aiDiagnostic ? (
                      <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-2">
                        <p className="text-xs font-bold text-primary flex items-center gap-1 mb-1">
                          <Sparkles className="w-3 h-3" /> AI Diagnostic:
                        </p>
                        <p className="text-xs text-foreground leading-relaxed">
                          {aiDiagnostic}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={getAiHelp}
                        disabled={isAiLoading}
                        className="w-full py-2 px-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-primary/30"
                      >
                        {isAiLoading ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Consulting AI Tutor...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            Ask AI why this is wrong
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="glass-panel-subtle p-6 rounded-2xl">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">XP Reward</h3>
              <p className="text-2xl font-bold text-primary flex items-center gap-2">
                <Trophy className="w-6 h-6" /> {challenge.xp_reward}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'result' && currentChallengeIndex !== null) {
    const challenge = challenges[currentChallengeIndex];
    return (
      <div className="max-w-2xl mx-auto text-center py-12 space-y-8">
        <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-success" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-2">Bug Exterminated!</h2>
          <p className="text-muted-foreground">You successfully fixed the code in {challenge.title}.</p>
        </div>
        <div className="glass-panel p-8 rounded-2xl">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-muted-foreground mb-1">XP Earned</p>
              <p className="text-3xl font-bold text-primary">+{challenge.xp_reward}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Skill Improved</p>
              <p className="text-3xl font-bold text-foreground">{challenge.language.charAt(0).toUpperCase() + challenge.language.slice(1)}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setGameState('listing')}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
          >
            Continue to Next Game
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default BugHuntGame;
