'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getCategories, 
  getWorkouts, 
  getSessions, 
  getStats,
  addWorkout,
  saveWorkouts,
  addSession,
  updateSession,
  deleteSession,
  getSessionById,
  type Category,
  type Workout,
  type WorkoutSession,
} from '@/lib/storage';

// Cache keys
export const QUERY_KEYS = {
  categories: ['categories'],
  workouts: ['workouts'],
  sessions: ['sessions'],
  stats: ['stats'],
  workout: (id: string) => ['workout', id],
  session: (id: string) => ['session', id],
  categoryWorkouts: (categoryId: string) => ['category-workouts', categoryId],
  workoutSessions: (workoutId: string) => ['workout-sessions', workoutId],
};

// Categories
export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: getCategories,
    staleTime: Infinity, // Categories rarely change
  });
}

// Workouts
export function useWorkouts() {
  return useQuery({
    queryKey: QUERY_KEYS.workouts,
    queryFn: getWorkouts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useWorkout(id: string) {
  const { data: workouts } = useWorkouts();
  return workouts?.find(w => w.id === id);
}

export function useCategoryWorkouts(categoryId: string) {
  const { data: workouts, isLoading } = useWorkouts();
  return {
    workouts: workouts?.filter(w => w.categoryId === categoryId) || [],
    isLoading,
  };
}

export function useAddWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workout: Omit<Workout, 'id' | 'createdAt'>) => {
      return Promise.resolve(addWorkout(workout));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts });
    },
  });
}

export function useUpdateWorkouts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workouts: Workout[]) => {
      saveWorkouts(workouts);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
    },
  });
}

// Sessions
export function useSessions() {
  return useQuery({
    queryKey: QUERY_KEYS.sessions,
    queryFn: getSessions,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.session(id),
    queryFn: () => getSessionById(id),
    staleTime: 2 * 60 * 1000,
  });
}

export function useWorkoutSessions(workoutId: string) {
  const { data: sessions, isLoading } = useSessions();
  const workoutSessions = sessions
    ?.filter(s => s.workoutId === workoutId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];
  
  return { sessions: workoutSessions, isLoading };
}

export function useAddSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (session: Omit<WorkoutSession, 'id'>) => {
      return Promise.resolve(addSession(session));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sessions });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<WorkoutSession, 'id'>> }) => {
      updateSession(id, updates);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sessions });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      deleteSession(id);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sessions });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
    },
  });
}

// Stats
export function useStats() {
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: getStats,
    staleTime: 60 * 1000, // 1 minute
  });
}
