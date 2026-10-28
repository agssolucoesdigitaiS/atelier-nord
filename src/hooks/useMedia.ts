import { useEffect, useState } from 'react';

export function useMedia(query: string, initial = false) {
  const [match, setMatch] = useState(() => (typeof window === 'undefined' ? initial : window.matchMedia(query).matches));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)');
export const useDesktop = () => useMedia('(min-width: 1024px)');
export const useFinePointer = () => useMedia('(hover: hover) and (pointer: fine)');
