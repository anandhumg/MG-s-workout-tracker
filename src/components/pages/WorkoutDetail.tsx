'use client'
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWorkout, useWorkoutSessions } from '@/hooks/useWorkoutData';
import { getSettings } from '@/lib/storage';
import { ArrowLeft, Calendar, Edit2, Play } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WorkoutDetail({id}: {id: string}) {

 const router = useRouter();
  const workout = useWorkout(id!);
  const { sessions } = useWorkoutSessions(id!);
  const settings = getSettings();
  const unit = settings.preferredUnit;

  if (!workout) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Button variant="ghost" size="icon" onClick={() => router.push(`/workouts/${id}`) }>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold truncate">{workout.title}</h1>
                {workout.notes && (
                  <p className="text-xs text-muted-foreground truncate">{workout.notes}</p>
                )}
              </div>
            </div>
            <Link href={`/workout/${workout.id}/session`}>
              <Button className="gap-2 h-10 shrink-0">
                <Play className="h-4 w-4" />
                Start
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 max-w-4xl mx-auto space-y-4 animate-fade-in">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Session History
            </h2>
            <p className="text-xs text-muted-foreground">{sessions.length} sessions</p>
          </div>

          <div className="space-y-2">
            {sessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-6 text-sm">
                No sessions yet. Start your first one!
              </p>
            ) : (
              sessions.map((session, index) => (
                <Card 
                  key={session.id} 
                  className="bg-secondary hover:shadow-md transition-all animate-slide-up group cursor-pointer active:scale-[0.98]" 
                  style={{ animationDelay: `${index * 20}ms` }}
                  onClick={() => router.push(`/session/${session.id}/edit`)}
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">{session.name}</p>
                          <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{session.sets.length} sets</span>
                          <span>•</span>
                          <span>
                            {session.sets.reduce((sum, set) => sum + set.reps, 0)} reps
                          </span>
                        </div>
                        {session.notes && (
                          <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1">{session.notes}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        {session.sets.slice(0, 3).map((set, idx) => (
                          <p key={idx} className="text-xs">
                            {set.reps} × {set.weight}{unit}
                          </p>
                        ))}
                        {session.sets.length > 3 && (
                          <p className="text-xs text-muted-foreground">+{session.sets.length - 3}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
