'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface TelemetryData {
  timeToDecisionMs: number;
  totalDistancePx: number;
  avgVelocityPxPerSec: number;
  erraticPathScore: number;
}

interface ObserverTrackerProps {
  children: ReactNode;
  onAction: (telemetry: TelemetryData) => void;
  className?: string;
}

export function ObserverTracker({ children, onAction, className }: ObserverTrackerProps) {
  const [isActive, setIsActive] = useState(false);
  const startTime = useRef<number>(0);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const totalDistance = useRef<number>(0);
  const directionChanges = useRef<number>(0);

  useEffect(() => {
    startTime.current = performance.now();
    setIsActive(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isActive) return;

    if (lastPos.current) {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      totalDistance.current += distance;

      // Track erratic motion (if they suddenly jerk mouse left/right)
      if (Math.abs(dx) > 50 || Math.abs(dy) > 50) {
        directionChanges.current += 1;
      }
    }
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName !== 'BUTTON') return;
    
    if (isActive) {
      const timeTakenMs = performance.now() - startTime.current;
      const velocity = (totalDistance.current / (timeTakenMs / 1000));

      onAction({ 
        timeToDecisionMs: Math.round(timeTakenMs),
        totalDistancePx: Math.round(totalDistance.current),
        avgVelocityPxPerSec: Math.round(velocity),
        erraticPathScore: Math.round((directionChanges.current / timeTakenMs) * 10000)
      });
      setIsActive(false);
    }
  };

  return (
    <div 
      className={clsx("relative cursor-default", className)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {isActive && (
        <div className="absolute -top-3 -right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse ring-4 ring-red-500/20" title="Observer SDK Advanced Physics Sensor Active" />
      )}
      {children}
    </div>
  );
}
