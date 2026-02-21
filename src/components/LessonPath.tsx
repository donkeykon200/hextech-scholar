import LessonCard from "./LessonCard";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/localDb";

const LessonPath = () => {
  const lessons = useLiveQuery(() => db.lessons.toArray());

  return (
    <div className="relative">
      {/* Path Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary opacity-30 -translate-x-1/2"></div>

      <div className="space-y-8">
        {(lessons || []).map((lesson, index) => (
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
