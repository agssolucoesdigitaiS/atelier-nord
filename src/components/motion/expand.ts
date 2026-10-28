import { gsap, EASE } from '../../lib/gsap';
import { img } from '../../lib/assets';

const ID = 'expand-overlay';

/**
 * Transição de imagem que se expande até preencher a viewport e então navega.
 * A página de destino abre com a mesma imagem em tela cheia; releaseExpand() desfaz o overlay.
 */
export function expandToProject(frame: HTMLElement, imageName: string, go: () => void, reduced: boolean) {
  document.getElementById(ID)?.remove();
  const r = frame.getBoundingClientRect();
  const overlay = document.createElement('div');
  overlay.id = ID;
  overlay.setAttribute('aria-hidden', 'true');
  Object.assign(overlay.style, {
    position: 'fixed', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`,
    zIndex: '90', overflow: 'hidden', background: '#171816', pointerEvents: 'none',
  });
  const pic = document.createElement('img');
  const current = frame.querySelector('img');
  pic.src = current?.currentSrc || img(imageName).src;
  pic.alt = '';
  Object.assign(pic.style, { width: '100%', height: '100%', objectFit: 'cover', display: 'block' });
  overlay.appendChild(pic);
  document.body.appendChild(overlay);

  if (reduced) { Object.assign(overlay.style, { left: '0', top: '0', width: '100vw', height: '100vh' }); go(); return; }
  gsap.timeline({ onComplete: go })
    .to(overlay, { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight, duration: 1.15, ease: EASE.inOut })
    .fromTo(pic, { scale: 1.045 }, { scale: 1, duration: 1.15, ease: EASE.inOut }, 0);
}

export function releaseExpand(reduced: boolean) {
  const o = document.getElementById(ID);
  if (!o) return;
  if (reduced) { o.remove(); return; }
  gsap.to(o, { autoAlpha: 0, duration: 0.7, delay: 0.15, ease: 'power2.out', onComplete: () => o.remove() });
}
