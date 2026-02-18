import LessonCard from "./LessonCard";
import { useLessonsWithProgress } from "@/hooks/useLessons";
import { Skeleton } from "@/components/ui/skeleton";

const LessonPath = () => {
  const { data: lessons, isLoading, error } = useLessonsWithProgress();

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center">
        <p className="text-destructive">Failed to load lessons. Please try again.</p>
      </div>
    );
  }

  if (!lessons?.length) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center">
        <p className="text-muted-foreground">No lessons available yet.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Path Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary opacity-30 -translate-x-1/2"></div>

      <div className="space-y-8">
        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="relative">
            {/* Connection Node */}
            <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 glow-cyan z-10"></div>

            <div className={index % 2 === 0 ? "pr-[55%]" : "pl-[55%]"}>
              <LessonCard
                title={lesson.title}
                description={lesson.description ?? ""}
                progress={lesson.progress}
                status={lesson.status}
                xp={lesson.xp_reward}
              />
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
