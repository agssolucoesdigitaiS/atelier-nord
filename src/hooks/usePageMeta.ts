import { useEffect } from 'react';
import { site } from '../data/site';

/** Título e descrição específicos por rota. */
export function usePageMeta(title: string | null, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${site.fullName}` : `${site.fullName} · ${site.tagline}`;
    if (description) {
      let m = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
      m.content = description;
    }
  }, [title, description]);
}
