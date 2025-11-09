"use client";
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useCategories, useCategoryWorkouts, useAddWorkout, useUpdateWorkouts } from '@/hooks/useWorkoutData';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CategoryDetail({id}: {id: string}) {
const router = useRouter();
  const { data: categories = [] } = useCategories();
  const { workouts } = useCategoryWorkouts(id!);
  const addWorkoutMutation = useAddWorkout();
  const updateWorkoutsMutation = useUpdateWorkouts();
  
  const [newWorkoutTitle, setNewWorkoutTitle] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const category = categories.find(c => c.id === id);

  const handleAddWorkout = () => {
    if (!newWorkoutTitle.trim() || !id) return;

    addWorkoutMutation.mutate({
      categoryId: id,
      title: newWorkoutTitle,
      favorite: false,
    });

    setNewWorkoutTitle('');
    setIsDialogOpen(false);
    toast.success('Workout added!');
  };

  const toggleFavorite = (workoutId: string) => {
    const updated = workouts.map(w => 
      w.id === workoutId ? { ...w, favorite: !w.favorite } : w
    );
    updateWorkoutsMutation.mutate([...workouts.filter(w => w.id !== workoutId), ...updated.filter(w => w.id === workoutId)]);
    toast.success('Favorite updated');
  };

  const deleteWorkout = (workoutId: string) => {
    const updated = workouts.filter(w => w.id !== workoutId);
    updateWorkoutsMutation.mutate(updated);
    toast.success('Workout deleted');
  };

  if (!category) return null;

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  <h1 className="text-xl font-bold truncate">{category.title}</h1>
                </div>
                <p className="text-xs text-muted-foreground">{workouts.length} workouts</p>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 shrink-0">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Workout</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    placeholder="Workout name (e.g., Bench Press)"
                    value={newWorkoutTitle}
                    onChange={(e) => setNewWorkoutTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddWorkout()}
                    className="text-base"
                  />
                  <Button onClick={handleAddWorkout} className="w-full h-11">
                    Add Workout
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 max-w-4xl mx-auto animate-fade-in">
        <div className="grid grid-cols-1 gap-3">
          {workouts.length === 0 ? (
            <Card className="p-6">
              <p className="text-center text-muted-foreground text-sm">
                No workouts yet. Add your first one!
              </p>
            </Card>
          ) : (
            workouts.map((workout, index) => (
              <Card 
                key={workout.id} 
                className="hover:shadow-lg transition-all animate-slide-up group active:scale-[0.98]"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <Link href={`/workout/${workout.id}`} className="block p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold group-hover:text-primary transition-colors truncate">
                        {workout.title}
                      </h3>
                      {workout.notes && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{workout.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(workout.id);
                        }}
                      >
                        <Heart 
                          className={`h-4 w-4 ${workout.favorite ? 'fill-primary text-primary' : ''}`} 
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={(e) => {
                          e.preventDefault();
                          if (confirm('Delete this workout?')) {
                            deleteWorkout(workout.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
