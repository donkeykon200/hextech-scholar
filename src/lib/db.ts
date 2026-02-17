import Dexie, { type Table } from 'dexie';

export interface LocalProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  updated_at: string;
}

export interface LocalCourse {
  id: string;
  title: string;
  description: string | null;
  difficulty: string | null;
  order: number;
  language: string;
  image_url: string | null;
}

export interface LocalLesson {
  id: string;
  course_id: string;
  title: string;
  content: string | null;
  order: number;
  xp_reward: number;
}

export interface LocalUserProgress {
  lesson_id: string;
  user_id: string;
  status: 'locked' | 'unlocked' | 'in_progress' | 'completed';
  completed_at: string | null;
  score: number | null;
  synced: boolean;
}

export class JaclangAcademyDB extends Dexie {
  profiles!: Table<LocalProfile>;
  courses!: Table<LocalCourse>;
  lessons!: Table<LocalLesson>;
  progress!: Table<LocalUserProgress>;

  constructor() {
    super('JaclangAcademyDB');
    this.version(1).stores({
      profiles: 'id, display_name',
      courses: 'id, title, order, language',
      lessons: 'id, course_id, order',
      progress: '[lesson_id+user_id], user_id, status, synced'
    });
  }
}

export const db = new JaclangAcademyDB();
