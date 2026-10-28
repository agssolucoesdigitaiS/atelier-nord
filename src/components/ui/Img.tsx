import { useRef, useState } from 'react';
import { img } from '../../lib/assets';
import { gsap, useGSAP, MOTION_OK, EASE, scheduleRefresh } from '../../lib/gsap';

type Props = {
  name: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** clip: revela por clip-path ao entrar na viewport */
  reveal?: 'clip' | 'clip-side' | 'none';
  /** intensidade do parallax em % (0 = desligado) */
  parallax?: number;
  priority?: boolean;
  imgClassName?: string;
  frameRef?: (el: HTMLDivElement | null) => void;
  /** x: o elemento pai controla o parallax horizontal (galeria horizontal) */
  parallaxAxis?: 'y' | 'x';
};

/**
 * Imagem responsiva com lazy load, srcset, layout estável (o tamanho vem do container),
 * revelação por máscara, parallax e fallback visual se o arquivo não carregar.
 */
export function Img({ name, alt, className = '', sizes = '100vw', reveal = 'clip', parallax = 0, priority = false, imgClassName = '', frameRef, parallaxAxis = 'y' }: Props) {
  const frame = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const { src, srcSet } = img(name);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const f = frame.current!;
      const inner = f.querySelector('[data-pz]');
      const pic = f.querySelector('img');
      if (reveal !== 'none') {
        const from = reveal === 'clip-side' ? 'inset(0% 100% 0% 0%)' : 'inset(100% 0% 0% 0%)';
        const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 90%', once: true } });
        tl.fromTo(f, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: EASE.inOut })
          .from(pic, { scale: 1.28, duration: 1.8, ease: EASE.out }, 0);
      }
      if (parallax && inner && parallaxAxis === 'y') {
        gsap.fromTo(inner, { yPercent: -parallax }, { yPercent: parallax, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
    });
    return () => mm.revert();
  }, { scope: frame });

  return (
    <div ref={(el) => { frame.current = el; frameRef?.(el); }} className={`img-frame ${className}`}>
      {failed ? (
        <div role="img" aria-label={alt} className="absolute inset-0 grid place-items-center bg-[#cfc9bd] text-ink/60">
          <span className="label px-4 text-center">Imagem indisponível · substituir em public/assets/img/{name}</span>
        </div>
      ) : (
        <div data-pz className="absolute inset-0" style={parallax ? (parallaxAxis === 'y' ? { top: `-${parallax + 2}%`, bottom: `-${parallax + 2}%` } : { left: `-${parallax + 2}%`, right: `-${parallax + 2}%` }) : undefined}>
          <img
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            // @ts-expect-error atributo válido em navegadores modernos
            fetchpriority={priority ? 'high' : 'auto'}
            className={imgClassName}
            onLoad={() => scheduleRefresh()}
            onError={() => setFailed(true)}
          />
        </div>
      )}
    </div>
  );
}
