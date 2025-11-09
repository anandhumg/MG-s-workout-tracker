"use client"
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCategories, useWorkouts } from '@/hooks/useWorkoutData';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

interface SearchResult {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  type: 'workout';
}

export function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: categories = [] } = useCategories();
  const { data: workouts = [] } = useWorkouts();

  // Create a map for quick category lookup
  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach(cat => {
      map.set(cat.id, cat);
    });
    return map;
  }, [categories]);

  // Search logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search through workouts
    workouts.forEach(workout => {
      if (workout.title.toLowerCase().includes(query)) {
        const category = categoryMap.get(workout.categoryId);
        if (category) {
          results.push({
            id: workout.id,
            title: workout.title,
            categoryId: workout.categoryId,
            categoryName: category.title,
            categoryIcon: category.icon,
            type: 'workout',
          });
        }
      }
    });

    // Also search by category name
    workouts.forEach(workout => {
      const category = categoryMap.get(workout.categoryId);
      if (category && category.title.toLowerCase().includes(query)) {
        // Avoid duplicates
        if (!results.find(r => r.id === workout.id)) {
          results.push({
            id: workout.id,
            title: workout.title,
            categoryId: workout.categoryId,
            categoryName: category.title,
            categoryIcon: category.icon,
            type: 'workout',
          });
        }
      }
    });

    return results.slice(0, 8); // Limit to 8 results
  }, [searchQuery, workouts, categoryMap]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setIsFocused(false);
  };

  const showResults = isFocused && searchQuery.trim() && searchResults.length > 0;

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search workouts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="pl-10 pr-10 h-11 bg-card border-border"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <Card className="absolute top-full mt-2 w-full z-50 overflow-hidden animate-scale-in shadow-lg">
          <div className="max-h-[400px] overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={result.id}
                onClick={() => {
                  setIsFocused(false);
                  setSearchQuery('');
                  if (result.type === 'workout') {
                    router.push(`/workout/${result.id}`);
                  }
                }}
                className={cn(
                  "block px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border last:border-0",
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{result.categoryIcon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{result.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {result.categoryName}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* No Results */}
      {isFocused && searchQuery.trim() && searchResults.length === 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 p-4 animate-scale-in shadow-lg">
          <p className="text-sm text-muted-foreground text-center">
            No workouts found for "{searchQuery}"
          </p>
        </Card>
      )}
    </div>
  );
}