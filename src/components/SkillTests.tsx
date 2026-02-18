import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Lock, Timer, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const SkillTests = () => {
  const [examMode, setExamMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examMode && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [examMode, timeLeft]);

  const tests = [
    { level: 1, title: "Syntax Mastery", reward: "50 XP", locked: false, description: "Basic syntax, types, and print statements." },
    { level: 5, title: "Graph Navigator", reward: "250 XP", locked: false, description: "Implementing complex graph traversals with walkers." },
    { level: 10, title: "Edge Architect", reward: "1000 XP", locked: true, description: "Designing scalable data schemas with custom edges." },
  ];

  const startTest = (title: string) => {
    setExamMode(true);
    toast.info(`Starting ${title}. Proctored mode enabled.`, {
      icon: <ShieldCheck className="text-primary" />,
      className: "glass-panel border-primary",
    });
  };

  if (examMode) {
    return (
      <div className="glass-panel p-12 rounded-3xl border-2 border-primary">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-2xl font-black uppercase tracking-tighter">SECURE EXAM IN PROGRESS</h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-2xl text-primary">
            <Timer />
            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>

        <div className="space-y-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <p className="text-muted-foreground font-mono">QUESTION 01 // LEVEL 05</p>
            <h3 className="text-2xl font-bold italic">"How do you define a walker that can visit multiple node types without explicit casting?"</h3>
          </div>

          <div className="grid gap-4">
            {["Use generic 'visit' ability", "Define specific 'can visit' for each", "Inherit from a base node class", "Walkers cannot visit multiple types"].map((opt, i) => (
              <button key={i} className="text-left p-4 rounded-xl border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all flex justify-between items-center group">
                <span>{opt}</span>
                <Zap size={16} className="opacity-0 group-hover:opacity-100 text-primary" />
              </button>
            ))}
          </div>

          <div className="pt-8 flex justify-between">
            <button onClick={() => setExamMode(false)} className="text-muted-foreground hover:text-red-500 underline underline-offset-4">Terminate Exam</button>
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-[0_0_30px_hsl(var(--primary)/0.4)]">Submit Answer</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex items-center gap-4 mb-8">
        <AlertTriangle className="text-destructive shrink-0" />
        <p className="text-sm text-destructive-foreground">Warning: Entering a test consumes 10 Energy units. Once started, you cannot exit without penalty.</p>
      </div>

      <div className="grid gap-6">
        {tests.map((test) => (
          <div
            key={test.level}
            className={`glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 transition-all ${test.locked ? 'opacity-60 grayscale' : 'hover:scale-[1.01]'}`}
          >
            <div className="w-20 h-20 rounded-2xl bg-secondary flex flex-col items-center justify-center border border-white/5 shrink-0">
              <span className="text-xs text-muted-foreground uppercase">Level</span>
              <span className="text-2xl font-black">{test.level}</span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
                {test.title}
                {test.locked && <Lock size={16} className="text-muted-foreground" />}
              </h3>
              <p className="text-muted-foreground text-sm">{test.description}</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-primary font-mono font-bold">{test.reward}</span>
              <button
                disabled={test.locked}
                onClick={() => startTest(test.title)}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  test.locked
                  ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                  : 'bg-white text-black hover:bg-primary hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                }`}
              >
                {test.locked ? 'Locked' : 'Initiate Test'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillTests;
