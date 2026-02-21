import { useEffect } from 'react';
import { db, seedDatabase } from '@/lib/localDb';
import { supabase } from '@/integrations/supabase/client';

export const useSync = () => {
  useEffect(() => {
    const initAndSync = async () => {
      // 1. Seed the local database if it's empty
      await seedDatabase();

      // 2. Background sync attempt
      try {
        // Check for connectivity
        if (!navigator.onLine) return;

        console.log('🔄 Attempting background sync...');

        // In a real app, we would fetch the session here
        // For this demo/roadmap, we'll simulate an anonymous sync or
        // just prepare the structure for when tables are added to Supabase.

        // Example: Push local progress
        const localProgress = await db.userProgress.toCollection().last();
        if (localProgress) {
          // Note: This will fail if the table 'user_progress' doesn't exist in Supabase yet,
          // which is expected based on our analysis of types.ts.
          const { error } = await supabase
            .from('user_progress')
            .upsert({
              user_id: localProgress.userId,
              overall_progress: localProgress.overallProgress,
              current_streak: localProgress.currentStreak,
              total_xp: localProgress.totalXp,
              updated_at: new Date().toISOString(),
            });

          if (error) {
            if (error.code === 'PGRST116' || error.message.includes('not found')) {
              console.log('📡 Supabase tables not yet created. Operating in Local-First mode.');
            } else {
              console.error('❌ Sync push error:', error);
            }
          } else {
            console.log('✅ Sync successful!');
            await db.userProgress.update(localProgress.id!, { lastSyncedAt: Date.now() });
          }
        }
      } catch (err) {
        console.warn('⚠️ Sync failed, continuing in offline mode:', err);
      }
    };

    initAndSync();

    // Background sync every 5 minutes
    const intervalId = setInterval(initAndSync, 5 * 60 * 1000);

    // Also sync when coming back online
    window.addEventListener('online', initAndSync);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('online', initAndSync);
    };
  }, []);
};
