'use client';

import { useState, useRef, ReactNode, useImperativeHandle, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface TelemetryData {
  timeToDecisionMs: number;
  totalDistancePx: number;
  avgVelocityPxPerSec: number;
  erraticPathScore: number;
}

export interface ObserverTrackerHandle {
  capture: () => void;
}

interface ObserverTrackerProps {
  children: ReactNode;
  onAction: (telemetry: TelemetryData) => void;
  className?: string;
}

export const ObserverTracker = forwardRef<ObserverTrackerHandle, ObserverTrackerProps>(
  function ObserverTracker({ children, onAction, className }, ref) {
    const [isActive, setIsActive] = useState(true);
    const startTime = useRef<number>(performance.now());
    const lastPos = useRef<{ x: number; y: number } | null>(null);
    const totalDistance = useRef<number>(0);
    const directionChanges = useRef<number>(0);

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isActive) return;
      if (lastPos.current) {
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        totalDistance.current += distance;
        if (Math.abs(dx) > 50 || Math.abs(dy) > 50) directionChanges.current += 1;
      }
      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    // Exposed via ref so button can call it directly
    const capture = () => {
      if (!isActive) return;
      const timeTakenMs = performance.now() - startTime.current;
      const velocity = totalDistance.current / (timeTakenMs / 1000);
      onAction({
        timeToDecisionMs: Math.round(timeTakenMs),
        totalDistancePx: Math.round(totalDistance.current),
        avgVelocityPxPerSec: Math.round(velocity),
        erraticPathScore: Math.round((directionChanges.current / timeTakenMs) * 10000),
      });
      setIsActive(false);
    };

    useImperativeHandle(ref, () => ({ capture }));

    return (
      <div className={clsx('relative', className)} onMouseMove={handleMouseMove}>
        {isActive && (
          <div className="absolute -top-3 -right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse ring-4 ring-red-500/20" />
        )}
        {children}
      </div>
    );
  }
);

