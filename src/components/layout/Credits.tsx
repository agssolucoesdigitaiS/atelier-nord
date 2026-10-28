import { site } from '../../data/site';

/** Créditos de desenvolvimento: edite em src/data/site.ts (site.credits). */
export function Credits() {
  const { label, author, url } = site.credits;
  return (
    <p>
      {label}{' '}
      {url ? <a href={url} target="_blank" rel="noreferrer" className="link-u text-paper/80">{author}</a> : <span className="text-paper/80">{author}</span>}
    </p>
  );
}
