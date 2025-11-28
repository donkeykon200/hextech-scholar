import LessonCard from "./LessonCard";

const lessons = [
  {
    title: "Introduction to Jaclang",
    description: "Learn the basics of Jaclang syntax and structure",
    progress: 100,
    status: "completed" as const,
    xp: 100,
  },
  {
    title: "Understanding Nodes",
    description: "Master the concept of nodes in Object Spatial Paradigm",
    progress: 100,
    status: "completed" as const,
    xp: 150,
  },
  {
    title: "Working with Walkers",
    description: "Learn how walkers traverse through your data structures",
    progress: 65,
    status: "available" as const,
    xp: 200,
  },
  {
    title: "Edges and Connections",
    description: "Connect nodes using edges to build complex graphs",
    progress: 0,
    status: "available" as const,
    xp: 175,
  },
  {
    title: "Advanced OSP Patterns",
    description: "Explore advanced patterns in Object Spatial Programming",
    progress: 0,
    status: "locked" as const,
    xp: 250,
  },
  {
    title: "Bi-LLM Integration",
    description: "Add AI capabilities to your Jaclang applications",
    progress: 0,
    status: "locked" as const,
    xp: 300,
  },
];

const LessonPath = () => {
  return (
    <div className="relative">
      {/* Path Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary opacity-30 -translate-x-1/2"></div>

      <div className="space-y-8">
        {lessons.map((lesson, index) => (
          <div key={index} className="relative">
            {/* Connection Node */}
            <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 glow-cyan z-10"></div>

            <div className={index % 2 === 0 ? "pr-[55%]" : "pl-[55%]"}>
              <LessonCard {...lesson} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-x-1/2"></div>
    </div>
  );
};

export default LessonPath;
