const BASE = `${import.meta.env.BASE_URL}assets/img/`;

/** Retorna src e srcset responsivos (960w / 1920w) para um render. */
export function img(name: string) {
  return {
    src: `${BASE}${name}-1920.webp`,
    srcSet: `${BASE}${name}-960.webp 960w, ${BASE}${name}-1920.webp 1920w`,
    small: `${BASE}${name}-960.webp`,
  };
}

/** Pré-carrega e decodifica uma imagem; resolve mesmo em caso de erro (nunca bloqueia). */
export function preloadImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const i = new Image();
    i.decoding = 'async';
    i.onload = () => (i.decode ? i.decode().then(() => resolve(true), () => resolve(true)) : resolve(true));
    i.onerror = () => resolve(false);
    i.src = src;
  });
}
