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

export interface LocalLesson {
  id: string;
  title: string;
  content: string;
  order: number;
  xp_reward: number;
  code_template?: string;
  expected_output?: string;
  language: string;
}

export interface LocalBugChallenge {
  id: string;
  title: string;
  description: string;
  broken_code: string;
  solution_code: string;
  language: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xp_reward: number;
}

export interface LocalUserMistake {
  id?: string;
  user_id: string;
  bug_challenge_id?: string;
  lesson_id?: string;
  wrong_code: string;
  attempted_at: string;
  resolved: boolean;
  synced: number;
}

export class JaclangLocalDb extends Dexie {
  lessonProgress!: Table<LocalLessonProgress>;
  userStats!: Table<LocalUserStats>;
  lessons!: Table<LocalLesson>;
  bugChallenges!: Table<LocalBugChallenge>;
  userMistakes!: Table<LocalUserMistake>;

  constructor() {
    super('JaclangAcademyDb');
    this.version(3).stores({
      lessonProgress: '++id, lesson_id, user_id, status, synced',
      userStats: 'user_id, synced',
      lessons: 'id, language, order',
      bugChallenges: 'id, language, difficulty',
      userMistakes: '++id, user_id, bug_challenge_id, lesson_id, resolved, synced'
    });
  }
}

export const db = new JaclangLocalDb();
