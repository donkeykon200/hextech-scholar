import React from 'react';
import { Users, UserPlus, MessageSquare, Handshake } from 'lucide-react';

const CollabWorkspace = () => {
  const activeProjects = [
    { id: 1, title: "Graph Neural Network Helper", author: "Neo", difficulty: "Hard", tags: ["Jaclang", "AI"], seekers: 3 },
    { id: 2, title: "Weather App Debugging", author: "Trinity", difficulty: "Easy", tags: ["Python", "API"], seekers: 1 },
    { id: 3, title: "Space Shooter Game", author: "Cypher", difficulty: "Medium", tags: ["JS", "Canvas"], seekers: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeProjects.map((project) => (
          <div key={project.id} className="glass-panel p-6 rounded-2xl border border-primary/20 hover:border-primary/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Users size={24} />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                project.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                project.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-red-500/10 text-red-500'
              }`}>
                {project.difficulty}
              </span>
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">Started by <span className="text-foreground font-medium">{project.author}</span></p>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map(tag => (
                <span key={tag} className="text-[10px] uppercase tracking-wider bg-secondary px-2 py-0.5 rounded border border-white/5 font-mono">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Handshake size={14} />
                <span>{project.seekers} helping</span>
              </div>
              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                <UserPlus size={16} />
                Join & Help
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <MessageSquare size={120} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Need a partner?</h2>
          <p className="text-muted-foreground mb-6 max-w-md">Start your own collaboration request and get help from our community of mentors and peers.</p>
          <button className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-all">
            Post Help Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollabWorkspace;
