import Dexie, { type Table } from 'dexie';

export interface LocalLesson {
  id?: string;
  title: string;
  description: string;
  xp: number;
  status: 'completed' | 'available' | 'locked';
  progress: number;
  languageId: string;
}

export interface UserProgress {
  id?: string;
  userId: string;
  overallProgress: number;
  currentStreak: number;
  totalXp: number;
  lastSyncedAt?: number;
}

export interface Achievement {
  id: string;
  label: string;
  value: string;
  color: string;
  unlocked: boolean;
}

export class HextechDatabase extends Dexie {
  lessons!: Table<LocalLesson>;
  userProgress!: Table<UserProgress>;
  achievements!: Table<Achievement>;

  constructor() {
    super('HextechScholarDB');
    this.version(1).stores({
      lessons: '++id, title, languageId, status',
      userProgress: '++id, userId',
      achievements: 'id, label'
    });
  }
}

export const db = new HextechDatabase();

// Initialize with sample data if empty
export const seedDatabase = async () => {
  const lessonCount = await db.lessons.count();
  if (lessonCount === 0) {
    await db.lessons.bulkAdd([
      {
        title: "Introduction to Jaclang",
        description: "Learn the basics of Jaclang syntax and structure",
        progress: 100,
        status: "completed",
        xp: 100,
        languageId: "jaclang"
      },
      {
        title: "Understanding Nodes",
        description: "Master the concept of nodes in Object Spatial Paradigm",
        progress: 100,
        status: "completed",
        xp: 150,
        languageId: "jaclang"
      },
      {
        title: "Working with Walkers",
        description: "Learn how walkers traverse through your data structures",
        progress: 65,
        status: "available",
        xp: 200,
        languageId: "jaclang"
      }
    ]);

    await db.achievements.bulkAdd([
      { id: "xp", label: "Total XP", value: "2,450", color: "text-warning", unlocked: true },
      { id: "streak", label: "Streak", value: "7", color: "text-destructive", unlocked: true },
      { id: "lessons", label: "Lessons", value: "12", color: "text-success", unlocked: true }
    ]);

    await db.userProgress.add({
      userId: 'default-user',
      overallProgress: 42,
      currentStreak: 7,
      totalXp: 2450
    });
  }
};
