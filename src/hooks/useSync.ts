import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { db } from '@/db/localDb';
import { useToast } from './use-toast';

export const useSync = (userId: string | undefined) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const syncData = async () => {
      try {
        // 1. Push local changes to Supabase
        const unsyncedProgress = await db.lessonProgress
          .where('synced')
          .equals(0)
          .toArray();

        for (const item of unsyncedProgress) {
          const { error } = await supabase
            .from('user_lesson_progress')
            .upsert({
              user_id: item.user_id,
              lesson_id: item.lesson_id,
              status: item.status,
              completed_at: item.completed_at,
              score: item.score
            });

          if (!error) {
            await db.lessonProgress.update(item.id!, { synced: 1 });
          }
        }

        // 2. Pull changes from Supabase
        const { data: remoteProgress, error: progressError } = await supabase
          .from('user_lesson_progress')
          .select('*')
          .eq('user_id', userId);

        if (!progressError && remoteProgress) {
          for (const remote of remoteProgress) {
            const local = await db.lessonProgress
              .where({ lesson_id: remote.lesson_id, user_id: userId })
              .first();

            if (!local || new Date(remote.completed_at || 0) > new Date(local.completed_at || 0)) {
              await db.lessonProgress.put({
                ...local,
                lesson_id: remote.lesson_id,
                user_id: userId,
                status: remote.status as any,
                completed_at: remote.completed_at,
                score: remote.score,
                synced: 1
              });
            }
          }
        }

        console.log('Sync complete');
      } catch (err) {
        console.error('Sync failed', err);
      }
    };

    // Initial sync
    syncData();

    // Listen for online status
    window.addEventListener('online', syncData);
    return () => window.removeEventListener('online', syncData);
  }, [userId]);
};
