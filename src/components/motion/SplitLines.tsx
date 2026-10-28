import { useRef, type ElementType } from 'react';
import { gsap, useGSAP, MOTION_OK, EASE } from '../../lib/gsap';

type Props = {
  text: string;                  // use \n para quebrar linhas
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  /** scroll: revela ao entrar na viewport. manual: um timeline externo anima [data-line]. */
  mode?: 'scroll' | 'manual';
  stagger?: number;
  delay?: number;
  start?: string;
  id?: string;
};

/**
 * Título revelado por linhas com máscara vertical.
 * O texto completo fica disponível para leitores de tela; as linhas animadas são aria-hidden.
 * Sem JS ou com movimento reduzido, o texto aparece normalmente.
 */
export function SplitLines({ text, as: Tag = 'h2', className, lineClassName, mode = 'scroll', stagger = 0.09, delay = 0, start = 'top 86%', id }: Props) {
  const ref = useRef<HTMLElement>(null);
  const lines = text.split('\n');

  useGSAP(() => {
    if (mode !== 'scroll') return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(ref.current!.querySelectorAll('[data-line]'), {
        yPercent: 115, rotate: 1.5, duration: 1.25, ease: EASE.out, stagger, delay,
        scrollTrigger: { trigger: ref.current, start, once: true },
      });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <Tag ref={ref} className={className} id={id} tabIndex={id ? -1 : undefined}>
      <span className="sr-only">{lines.join(' ')}</span>
      <span aria-hidden="true">
        {lines.map((l, i) => (
          <span key={i} className={`line-mask ${lineClassName ?? ''}`}>
            <span data-line>{l}</span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
