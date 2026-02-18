import React from 'react';
import { BookOpen, CheckCircle, Lightbulb, TrendingUp } from 'lucide-react';

const LearningSummaries = () => {
  const summaries = [
    { title: "Graph Structures", mastered: true, date: "2024-05-15", concepts: ["Nodes", "Edges", "Root", "Generic Graphs"] },
    { title: "Walker Logic", mastered: true, date: "2024-05-18", concepts: ["Entry Points", "Visitation", "Yielding", "State Carrying"] },
    { title: "Edge Connectors", mastered: false, progress: 65, concepts: ["Bidirectional", "Uni-directional", "Edge Classes"] },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {summaries.map((summary, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              {summary.mastered && (
                <div className="absolute top-0 right-0 p-4">
                  <CheckCircle className="text-green-500 w-6 h-6 animate-pulse" />
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/20 text-primary">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{summary.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {summary.mastered ? `Mastered on ${summary.date}` : "In Progress..."}
                  </p>
                </div>
              </div>

              {!summary.mastered && (
                <div className="w-full h-2 bg-secondary rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full bg-primary shadow-[0_0_10px_#00f2ff]"
                    style={{ width: `${summary.progress}%` }}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mt-4">
                {summary.concepts.map(concept => (
                  <div key={concept} className="flex items-center gap-2 text-sm text-foreground/80 bg-white/5 p-2 rounded-lg">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    {concept}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-yellow-500">
            <div className="flex items-center gap-2 mb-4 text-yellow-500">
              <Lightbulb size={20} />
              <h4 className="font-bold uppercase tracking-widest text-xs">AI Learning Insights</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Based on your recent practice, you excel at <span className="text-foreground font-medium">Graph Traversal</span> but might need more focus on <span className="text-foreground font-medium">Memory Efficiency</span> when using large walkers.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <TrendingUp size={20} />
              <h4 className="font-bold uppercase tracking-widest text-xs">Learning Velocity</h4>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-foreground">12</span>
              <span className="text-muted-foreground">concepts / week</span>
            </div>
            <p className="text-xs text-green-500 mt-2">+15% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningSummaries;
