import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type MousePosition = { x: number; y: number };

const MouseContext = createContext<MousePosition>({ x: 0, y: 0 });

export const MouseProvider = ({ children }: { children: ReactNode }) => {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    document.addEventListener('mousemove', handleMove);
    return () => document.removeEventListener('mousemove', handleMove);
  }, []);

  return <MouseContext.Provider value={pos}>{children}</MouseContext.Provider>;
};

export const useMousePosition = () => useContext(MouseContext);
