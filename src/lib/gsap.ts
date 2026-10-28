import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Curvas de easing do sistema de motion (consistentes em todo o site)
export const EASE = {
  inOut: 'expo.inOut',
  out: 'expo.out',
  soft: 'power3.out',
  line: 'power2.inOut',
};

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

let refreshTimer = 0;
/** Agenda um ScrollTrigger.refresh() com debounce (imagens, fontes, resize). */
export function scheduleRefresh(delay = 120) {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), delay);
}

export { gsap, ScrollTrigger, useGSAP };
