import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  xp_reward: number;
  code_template: string | null;
  expected_output: string | null;
  is_published: boolean;
}

export interface LessonWithProgress extends Lesson {
  progress: number;
  status: "locked" | "available" | "completed";
}

export function useLessons(courseId?: string) {
  return useQuery({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      let query = supabase
        .from("lessons")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (courseId) {
        query = query.eq("course_id", courseId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Lesson[];
    },
  });
}

export function useLessonsWithProgress(courseId?: string) {
  const lessonsQuery = useLessons(courseId);

  const progressQuery = useQuery({
    queryKey: ["user_lesson_progress"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  const lessons = lessonsQuery.data;
  const progress = progressQuery.data;

  const lessonsWithProgress: LessonWithProgress[] | undefined = lessons?.map((lesson, index) => {
    const lessonProgress = progress?.find((p) => p.lesson_id === lesson.id);

    let status: "locked" | "available" | "completed" = "available";
    let progressPercent = 0;

    if (lessonProgress) {
      if (lessonProgress.status === "completed") {
        status = "completed";
        progressPercent = 100;
      } else if (lessonProgress.status === "in_progress") {
        status = "available";
        progressPercent = lessonProgress.score ?? 50;
      } else if (lessonProgress.status === "locked") {
        status = "locked";
      } else {
        status = "available";
      }
    } else {
      // First two lessons available by default, rest locked if no auth/progress
      status = index < 2 ? "available" : "locked";
    }

    return {
      ...lesson,
      progress: progressPercent,
      status,
    };
  });

  return {
    data: lessonsWithProgress,
    isLoading: lessonsQuery.isLoading || progressQuery.isLoading,
    error: lessonsQuery.error || progressQuery.error,
  };
}

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}
