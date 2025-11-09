"use client";
import { ScrollerControl } from '@/components/ScrollerControl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAddSession, useWorkout } from '@/hooks/useWorkoutData';
import { getSettings, saveSettings } from '@/lib/storage';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface WorkoutSet {
  reps: number;
  weight: number;
}

export default function WorkoutSession({id}:{id: string}) {

  const router = useRouter();
  const workout = useWorkout(id!);
  const addSessionMutation = useAddSession();
  
  const [name, setName] = useState('');
  const [sets, setSets] = useState<WorkoutSet[]>([{ reps: 10, weight: 20 }]);
  const [notes, setNotes] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');

  useEffect(() => {
    const settings = getSettings();
    setUnit(settings.preferredUnit);
    
    // Set default session name with date
    const today = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    setName(`Session ${today}`);
  }, []);

  const addNewSet = () => {
    const newSet: WorkoutSet = {
      reps: 10,
      weight: 20,
    };
    setSets([...sets, newSet]);
  };

  const updateSet = (index: number, field: 'reps' | 'weight', value: number) => {
    setSets(sets.map((set, i) => 
      i === index ? { ...set, [field]: value } : set
    ));
  };

  const removeSet = (index: number) => {
    if (sets.length > 1) {
      setSets(sets.filter((_, i) => i !== index));
    }
  };

  const toggleUnit = () => {
    const newUnit = unit === 'kg' ? 'lbs' : 'kg';
    setUnit(newUnit);
    const settings = getSettings();
    saveSettings({ ...settings, preferredUnit: newUnit });
    toast.success(`Switched to ${newUnit}`);
  };

  const handleSave = () => {
    if (!workout || sets.length === 0 || !name.trim()) return;

    addSessionMutation.mutate({
      workoutId: workout.id,
      name: name.trim(),
      date: new Date().toISOString(),
      sets,
      notes,
    });

    toast.success('Session saved!');
    // navigate(`/workout/${workout.id}`);
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold truncate">{workout.title}</h1>
                <p className="text-xs text-muted-foreground">New Session</p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ml-2 shrink-0"
              onClick={toggleUnit}
            >
              {unit.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto animate-fade-in">
        <Card className="p-4">
          <label className="text-sm font-medium mb-2 block">Session Name</label>
          <Input
            placeholder="e.g., Morning workout, PR attempt"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-base"
          />
        </Card>

        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Sets</h2>
            <Button variant="outline" size="sm" onClick={addNewSet} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Set
            </Button>
          </div>

          <div className="space-y-3">
            {sets.map((set, index) => (
              <Card key={index} className="p-4 bg-secondary animate-scale-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">Set {index + 1}</h3>
                  {sets.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeSet(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center flex-col justify-around gap-4">
                  <ScrollerControl
                    value={set.reps}
                    onChange={(value) => updateSet(index, 'reps', value)}
                    min={1}
                    max={100}
                    label="Reps"
                  />
                  
                  <ScrollerControl
                    value={set.weight}
                    onChange={(value) => updateSet(index, 'weight', value)}
                    min={0}
                    max={500}
                    step={unit === 'kg' ? 2.5 : 5}
                    label={`Weight (${unit})`}
                  />
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <Input
              placeholder="How did it feel? Any adjustments?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-base"
            />
          </div>
        </Card>

        <Button 
          onClick={handleSave} 
          className="w-full gap-2 h-12 text-base" 
          disabled={!name.trim() || sets.length === 0}
        >
          <Save className="h-5 w-5" />
          Save Session
        </Button>
      </div>
    </div>
  );
}
