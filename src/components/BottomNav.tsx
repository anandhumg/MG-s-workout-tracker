'use client';

import { Home, FolderOpen, Star, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';


export default function BottomNav() {
  const pathname = usePathname();
const router = useRouter();
  const tabs = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/categories', icon: FolderOpen, label: 'Categories' },
    { path: '/favorites', icon: Star, label: 'Favorites' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 bg-background">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = pathname === path;

          return (
            <button
              key={path}
              onClick={()=>router.push(path)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
