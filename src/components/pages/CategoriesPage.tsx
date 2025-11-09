"use client"
import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react';
import { useCategories, useWorkouts } from '@/hooks/useWorkoutData';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { addCategory, updateCategory, deleteCategory } from '@/lib/storage';

const EMOJI_OPTIONS = ['💪', '🦾', '🦵', '🏋️', '🔥', '⚡', '🎯', '💯', '🚀', '⭐'];

export default function CategoriesPage() {
  const { data: categories = [], refetch: refetchCategories } = useCategories();
  const { data: workouts = [], refetch: refetchWorkouts } = useWorkouts();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('💪');

  const workoutCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach(cat => {
      counts[cat.id] = workouts.filter(w => w.categoryId === cat.id).length;
    });
    return counts;
  }, [categories, workouts]);

  const handleAddCategory = () => {
    if (categoryTitle.trim()) {
      addCategory({
        title: categoryTitle.trim(),
        icon: categoryIcon,
      });
      refetchCategories();
      setCategoryTitle('');
      setCategoryIcon('💪');
      setIsAddDialogOpen(false);
    }
  };

  const handleEditCategory = () => {
    if (selectedCategory && categoryTitle.trim()) {
      updateCategory(selectedCategory.id, {
        title: categoryTitle.trim(),
        icon: categoryIcon,
      });
      refetchCategories();
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      setCategoryTitle('');
      setCategoryIcon('💪');
    }
  };

  const handleDeleteCategory = () => {
    if (selectedCategory) {
      deleteCategory(selectedCategory.id);
      refetchCategories();
      refetchWorkouts();
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    }
  };

  const openEditDialog = (category: any) => {
    setSelectedCategory(category);
    setCategoryTitle(category.title);
    setCategoryIcon(category.icon);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Categories</h1>
            <p className="text-xs text-muted-foreground mt-1">Browse by muscle group</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new workout category
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Category Name</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Core, Cardio"
                    value={categoryTitle}
                    onChange={(e) => setCategoryTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <div className="flex gap-2 flex-wrap">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setCategoryIcon(emoji)}
                        className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                          categoryIcon === emoji
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory} disabled={!categoryTitle.trim()}>
                  Add Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="px-4 py-4 max-w-4xl mx-auto animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <Card className="p-4 hover:shadow-lg hover:border-primary/50 transition-all group">
                <div className="flex items-center justify-between gap-3">
                  <Link 
                    href={`/categories/${category.id}`}
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                  >
                    <div className="text-3xl">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {workoutCounts[category.id] || 0} workouts
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.preventDefault();
                        openEditDialog(category);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        openDeleteDialog(category);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category name and icon
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Category Name</Label>
              <Input
                id="edit-title"
                placeholder="e.g., Core, Cardio"
                value={categoryTitle}
                onChange={(e) => setCategoryTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex gap-2 flex-wrap">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setCategoryIcon(emoji)}
                    className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                      categoryIcon === emoji
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={!categoryTitle.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedCategory?.title}" and all {workoutCounts[selectedCategory?.id] || 0} workouts in this category, along with their session history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}