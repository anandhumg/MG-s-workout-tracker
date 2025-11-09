'use client'
import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, Target, Heart, Plus, Dumbbell } from 'lucide-react';
import { GlobalSearch } from '@/components/GlobalSearch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStats, useSessions, useWorkouts } from '@/hooks/useWorkoutData';
import Link from 'next/link';

export default function Dashboard() {
  const { data: stats } = useStats();
  const { data: sessions = [] } = useSessions();
  const { data: workouts = [] } = useWorkouts();

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const daySessions = sessions.filter(s => s.date.startsWith(date));
      const totalSets = daySessions.reduce((sum, s) => sum + s.sets.length, 0);
      return {
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        sets: totalSets,
      };
    });
  }, [sessions]);

  const recentWorkouts = useMemo(() => {
    const sortedSessions = [...sessions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Use a Set to track unique workout IDs
    const uniqueWorkoutIds = new Set<string>();
    const uniqueWorkouts = [];

    for (const session of sortedSessions) {
      if (!uniqueWorkoutIds.has(session.workoutId)) {
        const workout = workouts.find(w => w.id === session.workoutId);
        if (workout) {
          uniqueWorkoutIds.add(session.workoutId);
          uniqueWorkouts.push(workout);

          // Stop when we have 3 unique workouts
          if (uniqueWorkouts.length === 3) break;
        }
      }
    }

    return uniqueWorkouts;
  }, [sessions, workouts]);

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-background pb-safe">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className="h-7 w-7 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Workout Tracker</h1>
                <p className="text-xs text-muted-foreground">Track your gains</p>
              </div>
            </div>
            <Link href="/categories">
              <Button size="sm" className="gap-2 h-10">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New</span>
              </Button>
            </Link>
          </div>

          {/* Global Search */}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 max-w-6xl mx-auto animate-fade-in">
        <GlobalSearch />
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 hover:shadow-lg transition-shadow animate-slide-up">
            <div>
              <p className="text-xs text-muted-foreground">Workouts</p>
              <p className="text-2xl font-bold mt-1">{stats.totalWorkouts}</p>
            </div>
            <Activity className="h-8 w-8 text-primary opacity-60 ml-auto" />
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '50ms' }}>
            <div>
              <p className="text-xs text-muted-foreground">Total Sets</p>
              <p className="text-2xl font-bold mt-1">{stats.totalSets}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary opacity-60 ml-auto" />
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div>
              <p className="text-xs text-muted-foreground">Avg Reps</p>
              <p className="text-2xl font-bold mt-1">{stats.avgReps}</p>
            </div>
            <Target className="h-8 w-8 text-primary opacity-60 ml-auto" />
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '150ms' }}>
            <div>
              <p className="text-xs text-muted-foreground">Favorites</p>
              <p className="text-2xl font-bold mt-1">{stats.favoriteCount}</p>
            </div>
            <Heart className="h-8 w-8 text-primary opacity-60 ml-auto" />
          </Card>
        </div>

        {/* Chart */}
        <Card className="p-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-base font-semibold mb-3">Weekly Progress</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3d3d3d" />
              <XAxis dataKey="day" stroke="#bdbdbd" />
              <YAxis stroke="#bdbdbd" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#242424',
                  border: '1px solid #3d3d3d',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="sets" fill="#f25c54" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Workouts */}
        <Card className="p-4 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Recent Workouts</h2>
            <Link href="/categories">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-2">
            {recentWorkouts.length === 0 ? (
              <p className="text-center text-muted-foreground py-6 text-sm">
                No workouts yet. Start your first session!
              </p>
            ) : (
              recentWorkouts.map((workout: any) => (
                <Link key={workout.id} href={`/workout/${workout.id}`} >
                  <div className="p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer active:scale-[0.98]">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{workout.title}</p>
                      {workout.favorite && <Heart className="h-4 w-4 fill-primary text-primary" />}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}