'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { clsx } from 'clsx';

interface TelemetryData {
  timeToDecisionMs: number;
  hoverCount: number;
}

interface ObserverTrackerProps {
  children: ReactNode;
  onAction: (telemetry: TelemetryData) => void;
  className?: string;
}

export function ObserverTracker({ children, onAction, className }: ObserverTrackerProps) {
  const [hoverCount, setHoverCount] = useState(0);
  const startTime = useRef<number>(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    startTime.current = performance.now();
    setIsActive(true);
  }, []);

  const handleMouseEnter = () => setHoverCount((c) => c + 1);

  const handleClick = (e: React.MouseEvent) => {
    // Only capture clicks going to actionable buttons
    if ((e.target as HTMLElement).tagName !== 'BUTTON') return;
    
    if (isActive) {
      const timeTaken = Math.round(performance.now() - startTime.current);
      onAction({ timeToDecisionMs: timeTaken, hoverCount });
      setIsActive(false); // End tracking for this session
    }
  };

  return (
    <div 
      className={clsx("relative", className)}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      {/* Visual indicator that this zone is under Observer SDK surveillance */}
      {isActive && (
        <div className="absolute -top-3 -right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse ring-4 ring-red-500/20" title="Observer SDK Active" />
      )}
      {children}
    </div>
  );
}
