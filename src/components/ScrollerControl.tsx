'use client'
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Plus, Minus } from 'lucide-react';

interface ScrollerControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
}

export function ScrollerControl({ 
  value, 
  onChange, 
  min = 0, 
  max = 999, 
  step = 1,
  label 
}: ScrollerControlProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(value);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create tick sound using Web Audio API
    audioRef.current = new Audio();
    // Simple beep sound (data URI)
    audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTUIGGS56+yDVhQIQprc8Mqf';
  }, []);

  const playTick = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    if (newValue !== value) {
      onChange(newValue);
      playTick();
    }
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    if (newValue !== value) {
      onChange(newValue);
      playTick();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartValue(value);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartValue(value);
  };

  useEffect(() => {
    const handleMove = (clientY: number) => {
      if (!isDragging) return;
      
      const deltaY = startY - clientY;
      const steps = Math.floor(deltaY / 10);
      const newValue = Math.max(min, Math.min(max, startValue + steps * step));
      
      if (newValue !== value && Math.abs(steps) > 0) {
        onChange(newValue);
        playTick();
      }
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientY);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientY);
    
    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, startY, startValue, value, min, max, step, onChange]);

  return (
    <div className="flex flex-col items-center gap-2 touch-none">
      <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          className="h-11 w-11 rounded-full border-2 hover:bg-primary hover:text-primary-foreground transition-all active:scale-90 touch-manipulation"
        >
          <Minus className="h-5 w-5" />
        </Button>
        
        <div
          className={`relative select-none cursor-ns-resize ${isDragging ? 'scale-105' : ''} transition-transform touch-none`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const newValue = Math.max(min, Math.min(max, parseInt(e.target.value) || 0));
              onChange(newValue);
            }}
            className="w-20 h-14 text-center text-2xl font-bold bg-card border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all touch-manipulation"
            min={min}
            max={max}
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          className="h-11 w-11 rounded-full border-2 hover:bg-primary hover:text-primary-foreground transition-all active:scale-90 touch-manipulation"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
