import Dexie, { type Table } from 'dexie';

export interface LocalLessonProgress {
  id?: number;
  lesson_id: string;
  user_id: string;
  status: 'locked' | 'unlocked' | 'in_progress' | 'completed';
  completed_at?: string;
  score?: number;
  synced: number; // 0 for no, 1 for yes
}

export interface LocalUserStats {
  user_id: string;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  level: number;
  synced: number;
}

export class JaclangLocalDb extends Dexie {
  lessonProgress!: Table<LocalLessonProgress>;
  userStats!: Table<LocalUserStats>;

  constructor() {
    super('JaclangAcademyDb');
    this.version(1).stores({
      lessonProgress: '++id, lesson_id, user_id, status, synced',
      userStats: 'user_id, synced'
    });
  }
}

export const db = new JaclangLocalDb();
