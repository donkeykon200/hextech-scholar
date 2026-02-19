import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { db, type LocalLesson } from "@/db/localDb";
import LessonCard from "./LessonCard";
import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface LessonPathProps {
  onLessonSelect?: (lesson: LocalLesson) => void;
  language?: string;
}

const defaultLessons: Record<string, LocalLesson[]> = {
  jaclang: [
    {
      id: "jac-1",
      title: "Introduction to Walkers",
      content: "Walkers are the primary way to traverse graphs in Jaclang.",
      order: 1,
      xp_reward: 100,
      code_template: 'walker greet {\n    can visit {\n        print("Hello from Jaclang!");\n    }\n}\n\nnode root {}\n\nwith entry {\n    root spawn greet();\n}',
      expected_output: "Hello from Jaclang!"
    }
  ],
  python: [
    {
      id: "py-1",
      title: "Hello Python",
      content: "Learn how to print output in Python.",
      order: 1,
      xp_reward: 100,
      code_template: 'print("Hello Python!")',
      expected_output: "Hello Python!"
    }
  ],
  javascript: [
    {
      id: "js-1",
      title: "Hello JavaScript",
      content: "Learn how to use console.log() in JavaScript.",
      order: 1,
      xp_reward: 100,
      code_template: 'console.log("Hello JS!");',
      expected_output: "Hello JS!"
    }
  ],
  java: [
    {
      id: "java-1",
      title: "Hello Java",
      content: "Learn how to output text in Java.",
      order: 1,
      xp_reward: 100,
      code_template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Java!");\n    }\n}',
      expected_output: "Hello Java!"
    }
  ],
  cpp: [
    {
      id: "cpp-1",
      title: "Hello C++",
      content: "Learn how to use std::cout in C++.",
      order: 1,
      xp_reward: 100,
      code_template: '#include <iostream>\n\nint main() {\n    std::cout << "Hello C++!" << std::endl;\n    return 0;\n}',
      expected_output: "Hello C++!"
    }
  ]
};

const LessonPath = ({ onLessonSelect, language = 'jaclang' }: LessonPathProps) => {
  const { user } = useAuth();

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
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
        if (data && data.length > 0) {
          // Cache lessons in local DB for offline use
          for (const lesson of data) {
            await db.lessons.put({
              id: lesson.id,
              title: lesson.title,
              content: lesson.content,
              order: lesson.order,
              xp_reward: lesson.xp_reward,
              code_template: lesson.code_template,
              expected_output: lesson.expected_output,
              language: (lesson as unknown as { courses: { language: string } }).courses.language
            });
          }
          return data;
        }
      } catch (e) {
        console.warn("Supabase fetch failed, falling back to local DB", e);
      }

      // Fallback to local DB
      const localLessons = await db.lessons.where('language').equals(language).sortBy('order');
      if (localLessons.length > 0) return localLessons;

      // Final fallback to default lessons
      return defaultLessons[language] || [];
    },
    retry: false
  });

  const { data: progressMap, isLoading: progressLoading } = useQuery({
    queryKey: ['user_progress', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id, status, score')
        .eq('user_id', user?.id);

      if (error) throw error;

      const map: Record<string, { status: string; score?: number }> = {};
      data?.forEach(item => {
        map[item.lesson_id] = item;
      });
      return map;
    }
  });

  const isLoading = lessonsLoading || (!!user && progressLoading);

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
        {lessons?.map((lesson, index) => {
          const progress = progressMap?.[lesson.id];
          const status = progress?.status || (index === 0 ? 'available' : 'locked');
          // For now, if previous lesson is completed, this one is available
          const isAvailable = index === 0 ||
                              progressMap?.[lessons[index-1].id]?.status === 'completed' ||
                              status === 'completed' ||
                              status === 'in_progress';

          return (
            <div key={lesson.id} className="relative">
              {/* Connection Node */}
              <div className={`absolute left-1/2 top-1/2 w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 z-10
                ${status === 'completed' ? 'bg-success glow-cyan' : isAvailable ? 'bg-primary glow-cyan' : 'bg-muted'}
              `}></div>

              <div className={index % 2 === 0 ? "pr-[55%]" : "pl-[55%]"}>
                <LessonCard
                  title={lesson.title}
                  description={lesson.content?.substring(0, 100) + '...'}
                  progress={status === 'completed' ? 100 : (status === 'in_progress' ? 50 : 0)}
                  status={isAvailable ? (status === 'completed' ? 'completed' : 'available') : 'locked'}
                  xp={lesson.xp_reward}
                  onClick={() => onLessonSelect?.(lesson)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-x-1/2"></div>
    </div>
  );
};

export default LessonPath;
