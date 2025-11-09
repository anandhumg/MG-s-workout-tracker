// Offline-first local storage utilities
'use client'
export interface Category {
  id: string;
  title: string;
  icon: string;
  createdAt: string;
}

export interface Workout {
  id: string;
  categoryId: string;
  title: string;
  notes?: string;
  favorite: boolean;
  createdAt: string;
}

export interface WorkoutSet {
  reps: number;
  weight: number;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  name: string;
  date: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface UserSettings {
  preferredUnit: 'kg' | 'lbs';
}

const STORAGE_KEYS = {
  CATEGORIES: 'workout_categories',
  WORKOUTS: 'workout_workouts',
  SESSIONS: 'workout_sessions',
  SETTINGS: 'workout_settings',
};

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ========== CATEGORIES ==========

export function getCategories(): Category[] {
  const categories = getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, []);
  // Initialize with default categories if empty
  if (categories.length === 0) {
    const defaultCategories = getDefaultCategories();
    saveCategories(defaultCategories);
    return defaultCategories;
  }
  return categories;
}

export function saveCategories(categories: Category[]): void {
  setToStorage(STORAGE_KEYS.CATEGORIES, categories);
}

export function getDefaultCategories(): Category[] {
  return [
    { id: '1', title: 'Chest', icon: '💪', createdAt: new Date().toISOString() },
    { id: '2', title: 'Back', icon: '🦾', createdAt: new Date().toISOString() },
    { id: '3', title: 'Legs', icon: '🦵', createdAt: new Date().toISOString() },
    { id: '4', title: 'Shoulders', icon: '🏋️', createdAt: new Date().toISOString() },
    { id: '5', title: 'Arms', icon: '💪', createdAt: new Date().toISOString() },
    { id: '6', title: 'Abs', icon: '🔥', createdAt: new Date().toISOString() },
  ];
}

export function addCategory(category: Omit<Category, 'id' | 'createdAt'>): Category {
  const categories = getCategories();
  const newCategory: Category = {
    ...category,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  saveCategories([...categories, newCategory]);
  return newCategory;
}

export function updateCategory(categoryId: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>): void {
  const categories = getCategories();
  const updated = categories.map(c => 
    c.id === categoryId ? { ...c, ...updates } : c
  );
  saveCategories(updated);
}

export function deleteCategory(categoryId: string): void {
  const categories = getCategories();
  const workouts = getWorkouts();
  const sessions = getSessions();
  
  // Get all workout IDs in this category
  const workoutIdsToDelete = workouts
    .filter(w => w.categoryId === categoryId)
    .map(w => w.id);
  
  // Delete all sessions for workouts in this category
  const updatedSessions = sessions.filter(s => !workoutIdsToDelete.includes(s.workoutId));
  saveSessions(updatedSessions);
  
  // Delete all workouts in this category
  const updatedWorkouts = workouts.filter(w => w.categoryId !== categoryId);
  saveWorkouts(updatedWorkouts);
  
  // Delete the category
  const updatedCategories = categories.filter(c => c.id !== categoryId);
  saveCategories(updatedCategories);
}

export function getCategoryById(categoryId: string): Category | undefined {
  const categories = getCategories();
  return categories.find(c => c.id === categoryId);
}

// ========== WORKOUTS ==========

export function getWorkouts(): Workout[] {
  return getFromStorage<Workout[]>(STORAGE_KEYS.WORKOUTS, []);
}

export function saveWorkouts(workouts: Workout[]): void {
  setToStorage(STORAGE_KEYS.WORKOUTS, workouts);
}

export function addWorkout(workout: Omit<Workout, 'id' | 'createdAt'>): Workout {
  const workouts = getWorkouts();
  const newWorkout: Workout = {
    ...workout,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  saveWorkouts([...workouts, newWorkout]);
  return newWorkout;
}

export function updateWorkout(workoutId: string, updates: Partial<Omit<Workout, 'id' | 'createdAt'>>): void {
  const workouts = getWorkouts();
  const updated = workouts.map(w => 
    w.id === workoutId ? { ...w, ...updates } : w
  );
  saveWorkouts(updated);
}

export function deleteWorkout(workoutId: string): void {
  const workouts = getWorkouts();
  const sessions = getSessions();
  
  // Delete all sessions for this workout
  const updatedSessions = sessions.filter(s => s.workoutId !== workoutId);
  saveSessions(updatedSessions);
  
  // Delete the workout
  const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
  saveWorkouts(updatedWorkouts);
}

export function getWorkoutById(workoutId: string): Workout | undefined {
  const workouts = getWorkouts();
  return workouts.find(w => w.id === workoutId);
}

export function getWorkoutsByCategory(categoryId: string): Workout[] {
  const workouts = getWorkouts();
  return workouts.filter(w => w.categoryId === categoryId);
}

// ========== SESSIONS ==========

export function getSessions(): WorkoutSession[] {
  return getFromStorage<WorkoutSession[]>(STORAGE_KEYS.SESSIONS, []);
}

export function saveSessions(sessions: WorkoutSession[]): void {
  setToStorage(STORAGE_KEYS.SESSIONS, sessions);
}

export function addSession(session: Omit<WorkoutSession, 'id'>): WorkoutSession {
  const sessions = getSessions();
  const newSession: WorkoutSession = {
    ...session,
    id: Date.now().toString(),
  };
  saveSessions([...sessions, newSession]);
  return newSession;
}

export function updateSession(sessionId: string, updates: Partial<Omit<WorkoutSession, 'id'>>): void {
  const sessions = getSessions();
  const updated = sessions.map(s => 
    s.id === sessionId ? { ...s, ...updates } : s
  );
  saveSessions(updated);
}

export function deleteSession(sessionId: string): void {
  const sessions = getSessions();
  const updated = sessions.filter(s => s.id !== sessionId);
  saveSessions(updated);
}

export function getSessionById(sessionId: string): WorkoutSession | undefined {
  const sessions = getSessions();
  return sessions.find(s => s.id === sessionId);
}

export function getSessionsByWorkout(workoutId: string): WorkoutSession[] {
  const sessions = getSessions();
  return sessions.filter(s => s.workoutId === workoutId);
}

// ========== SETTINGS ==========

export function getSettings(): UserSettings {
  return getFromStorage<UserSettings>(STORAGE_KEYS.SETTINGS, { preferredUnit: 'kg' });
}

export function saveSettings(settings: UserSettings): void {
  setToStorage(STORAGE_KEYS.SETTINGS, settings);
}

// ========== STATS ==========

export function getStats() {
  const sessions = getSessions();
  const workouts = getWorkouts();
  
  const totalSets = sessions.reduce((sum, session) => sum + session.sets.length, 0);
  const totalReps = sessions.reduce((sum, session) => 
    sum + session.sets.reduce((reps, set) => reps + set.reps, 0), 0
  );
  
  const avgReps = totalSets > 0 ? Math.round(totalReps / totalSets) : 0;
  
  // Get sessions from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentSessions = sessions.filter(s => new Date(s.date) >= sevenDaysAgo);
  
  return {
    totalWorkouts: sessions.length,
    totalSets,
    avgReps,
    recentSessions: recentSessions.length,
    favoriteCount: workouts.filter(w => w.favorite).length,
  };
}

export function getCategoryStats(categoryId: string) {
  const workouts = getWorkoutsByCategory(categoryId);
  const workoutIds = workouts.map(w => w.id);
  const sessions = getSessions().filter(s => workoutIds.includes(s.workoutId));
  
  const totalSets = sessions.reduce((sum, session) => sum + session.sets.length, 0);
  const totalReps = sessions.reduce((sum, session) => 
    sum + session.sets.reduce((reps, set) => reps + set.reps, 0), 0
  );
  
  return {
    workoutCount: workouts.length,
    sessionCount: sessions.length,
    totalSets,
    totalReps,
  };
}