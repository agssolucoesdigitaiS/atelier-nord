import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap';

/** Desenhos conceituais em traço fino (SVG), desenhados conforme entram na tela. */
export function ConceptDrawing({ kind, title }: { kind: 'program' | 'volume' | 'section'; title: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const paths = ref.current!.querySelectorAll('[data-draw]');
      gsap.fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', stagger: 0.06, scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true } });
      gsap.from(ref.current!.querySelectorAll('[data-label]'), { autoAlpha: 0, duration: 0.8, stagger: 0.1, delay: 1.2, scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true } });
    });
    return () => mm.revert();
  }, { scope: ref });

  const P = (d: string, w = 1) => <path data-draw d={d} pathLength={1} strokeDasharray="1" strokeWidth={w} vectorEffect="non-scaling-stroke" />;
  return (
    <svg ref={ref} viewBox="0 0 400 260" role="img" aria-label={title} className="h-full w-full" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <title>{title}</title>
      {kind === 'program' && (
        <g>
          {P('M60 130 a55 55 0 1 0 110 0 a55 55 0 1 0 -110 0')}
          {P('M175 95 a40 40 0 1 0 80 0 a40 40 0 1 0 -80 0')}
          {P('M190 175 a32 32 0 1 0 64 0 a32 32 0 1 0 -64 0')}
          {P('M268 135 a48 48 0 1 0 96 0 a48 48 0 1 0 -96 0')}
          {P('M165 120 L182 106')}{P('M160 150 L194 168')}{P('M252 105 L276 120')}{P('M250 168 L276 150')}
          {P('M20 240 L380 240', 0.6)}
          <g data-label fontSize="10" fill="currentColor" stroke="none" fontFamily="Manrope Variable, sans-serif" letterSpacing="1.4">
            <text x="88" y="134">ESTAR</text><text x="196" y="99">COZINHA</text><text x="206" y="179">APOIO</text><text x="294" y="139">SUÍTES</text>
            <text x="20" y="232" opacity=".6">01 — PROGRAMA E RELAÇÕES</text>
          </g>
        </g>
      )}
      {kind === 'volume' && (
        <g>
          {P('M80 170 L200 220 L330 160 L210 115 Z')}
          {P('M80 170 L80 140 L200 190 L200 220')}{P('M200 190 L330 130 L330 160')}
          {P('M60 135 L210 195 L360 125 L210 70 Z')}
          {P('M60 135 L60 100 L210 160 L210 195')}{P('M210 160 L360 90 L360 125')}{P('M60 100 L210 38 L360 90')}
          {P('M120 125 L170 145', 0.6)}{P('M220 150 L300 113', 0.6)}
          {P('M30 230 L380 230', 0.6)}
          <g data-label fontSize="10" fill="currentColor" stroke="none" fontFamily="Manrope Variable, sans-serif" letterSpacing="1.4">
            <text x="20" y="250" opacity=".6">02 — ESTUDO DE VOLUMETRIA · BALANÇO 5 M</text>
          </g>
        </g>
      )}
      {kind === 'section' && (
        <g>
          {P('M30 220 L370 220', 1.4)}
          {P('M60 220 L60 120 L250 120')}{P('M60 120 L60 70 L340 70 L340 120 L250 120')}{P('M60 70 L60 62 L340 62 L340 70')}
          {P('M250 120 L250 220', 0.6)}{P('M90 120 L90 220', 0.6)}
          {P('M340 120 L340 150', 0.6)}{P('M340 150 L370 150', 0.6)}
          {P('M120 70 L120 120', 0.5)}{P('M200 70 L200 120', 0.5)}{P('M280 70 L280 120', 0.5)}
          {P('M300 40 L340 62', 0.6)}{P('M300 40 L290 36', 0.6)}
          {P('M20 220 L20 62', 0.5)}{P('M15 120 L25 120', 0.5)}{P('M15 62 L25 62', 0.5)}{P('M15 220 L25 220', 0.5)}
          <g data-label fontSize="10" fill="currentColor" stroke="none" fontFamily="Manrope Variable, sans-serif" letterSpacing="1.4">
            <text x="300" y="34">SOL 16H</text>
            <text x="30" y="250" opacity=".6">03 — CORTE AA · ESC. 1:100</text>
            <text x="26" y="96" fontSize="8">+3,60</text><text x="26" y="215" fontSize="8">±0,00</text>
          </g>
        </g>
      )}
    </svg>
  );
}
