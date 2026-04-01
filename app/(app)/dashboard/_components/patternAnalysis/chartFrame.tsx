"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ChartSize {
  height: number;
  width: number;
}

interface ChartFrameProps {
  children: (size: ChartSize) => ReactNode;
  className?: string;
}

export function ChartFrame({ children, className }: ChartFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<ChartSize | null>(null);

  useEffect(() => {
    const element = containerRef.current;

    if (!element || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const updateSize = (nextWidth: number, nextHeight: number) => {
      const width = Math.round(nextWidth);
      const height = Math.round(nextHeight);

      if (width <= 0 || height <= 0) {
        return;
      }

      setSize((currentSize) => {
        if (
          currentSize &&
          currentSize.width === width &&
          currentSize.height === height
        ) {
          return currentSize;
        }

        return { width, height };
      });
    };

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      updateSize(entry.contentRect.width, entry.contentRect.height);
    });

    const { height, width } = element.getBoundingClientRect();

    updateSize(width, height);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={["min-w-0", className].filter(Boolean).join(" ")}
      ref={containerRef}
    >
      {size ? children(size) : null}
    </div>
  );
}
