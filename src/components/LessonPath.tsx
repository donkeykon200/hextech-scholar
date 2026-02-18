import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/db/localDb";
import LessonCard from "./LessonCard";
import { Loader2 } from "lucide-react";

interface LessonPathProps {
  onLessonSelect?: (lesson: any) => void;
  language?: string;
}

const defaultLessons = [
  {
    id: "1",
    title: "Introduction to Walkers",
    content: "Walkers are the primary way to traverse graphs in Jaclang. They can carry data and execute abilities when visiting nodes.",
    order: 1,
    xp_reward: 100,
    code_template: 'walker greet {\n    can visit {\n        print("Hello from Jaclang!");\n    }\n}\n\nnode root {}\n\nwith entry {\n    root spawn greet();\n}',
    expected_output: "Hello from Jaclang!"
  },
  {
    id: "2",
    title: "Understanding Nodes",
    content: "Nodes are the fundamental units of data in the Object Spatial Paradigm.",
    order: 2,
    xp_reward: 150,
    code_template: 'node user {\n    has name: string;\n}\n\nwith entry {\n    u = spawn user(name="Jules");\n    print(u.name);\n}',
    expected_output: "Jules"
  }
];

const LessonPath = ({ onLessonSelect, language = 'jaclang' }: LessonPathProps) => {
  const { data: lessons, isLoading } = useQuery({
    queryKey: ['lessons', language],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('lessons')
          .select(`
            *,
            courses!inner(language)
          `)
          .eq('courses.language', language)
          .order('order', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) return data;
      } catch (e) {
        console.warn("Supabase fetch failed, falling back to local DB", e);
      }

      // Fallback to local DB
      const localLessons = await db.lessons.where('language').equals(language).sortBy('order');
      if (localLessons.length > 0) return localLessons;

      // Final fallback to default lessons if language is jaclang
      return language === 'jaclang' ? defaultLessons : [];
    },
    retry: false
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Path Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary opacity-30 -translate-x-1/2"></div>

      <div className="space-y-8">
        {lessons?.map((lesson, index) => (
          <div key={lesson.id} className="relative">
            {/* Connection Node */}
            <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 glow-cyan z-10"></div>

            <div className={index % 2 === 0 ? "pr-[55%]" : "pl-[55%]"}>
              <LessonCard
                title={lesson.title}
                description={lesson.content?.substring(0, 100) + '...'}
                progress={0} // We can integrate user_lesson_progress here later
                status="available"
                xp={lesson.xp_reward}
                onClick={() => onLessonSelect?.(lesson)}
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
