import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { db } from '@/lib/db';

export const useSync = (userId: string | undefined) => {
  useEffect(() => {
    if (!userId) return;

    const syncData = async () => {
      // 1. Fetch courses and lessons from Supabase and cache them locally
      const { data: courses } = await supabase.from('courses').select('*');
      if (courses) {
        await db.courses.bulkPut(courses);
      }

      const { data: lessons } = await supabase.from('lessons').select('*');
      if (lessons) {
        await db.lessons.bulkPut(lessons);
      }

      // 2. Sync local unsynced progress to Supabase
      const unsyncedProgress = await db.progress
        .where('synced')
        .equals(0) // false
        .toArray();

      for (const p of unsyncedProgress) {
        const { error } = await supabase.from('user_lesson_progress').upsert({
          user_id: p.user_id,
          lesson_id: p.lesson_id,
          status: p.status,
          completed_at: p.completed_at,
          score: p.score
        });

        if (!error) {
          await db.progress.update([p.lesson_id, p.user_id], { synced: true });
        }
      }

      // 3. Fetch latest progress from Supabase
      const { data: remoteProgress } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', userId);

      if (remoteProgress) {
        await db.progress.bulkPut(
          remoteProgress.map((p) => ({
            lesson_id: p.lesson_id,
            user_id: p.user_id,
            status: p.status as any,
            completed_at: p.completed_at,
            score: p.score,
            synced: true
          }))
        );
      }
    };

    syncData();

    // Set up a periodic sync every 5 minutes if online
    const interval = setInterval(() => {
      if (navigator.onLine) syncData();
    }, 1000 * 60 * 5);

    return () => clearInterval(interval);
  }, [userId]);
};
