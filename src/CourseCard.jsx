import { Link } from 'react-router-dom';
import { Clock, Star, Users } from 'lucide-react';
import { asset, money } from './api.js';

export const Cover = ({ src, alt = '', className = '' }) =>
  src ? <img src={asset(src)} alt={alt} loading="lazy" className={`object-cover ${className}`} /> : <div className={`bg-gradient-to-br from-navy-700 to-navy-900 ${className}`} role="img" aria-label={alt} />;

export default function CourseCard({ c }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-card transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-lg">
      <Link to={`/cursos/${c.slug}`} className="relative block" tabIndex={-1} aria-hidden="true">
        <Cover src={c.image} className="aspect-[16/10] w-full" />
        {c.category && <span className="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-ink shadow">{c.category}</span>}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-sm">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
          {c.reviews_count ? <><b className="text-amber-700">{c.rating}</b><span className="text-slate-700">({c.reviews_count} {c.reviews_count === 1 ? 'reseña' : 'reseñas'})</span></> : <span className="text-slate-700">Sin reseñas aún</span>}
        </p>
        <h3 className="mt-1.5 text-lg font-bold leading-snug text-navy-900"><Link to={`/cursos/${c.slug}`} className="hover:text-brand-500">{c.title}</Link></h3>
        <p className="mt-1.5 line-clamp-2 text-[15px] text-slate-800">{c.short_desc}</p>
        {c.instructor && <p className="mt-2 text-sm font-semibold text-ink">Por {c.instructor}</p>}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-300 pt-3 text-sm font-medium text-slate-800">
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden="true" />{c.duration_hours} h</span>
          <span className="flex items-center gap-1.5"><Users className="h-4 w-4" aria-hidden="true" />{c.level}</span>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-4">
          <p className="whitespace-nowrap font-display text-2xl font-extrabold text-brand-500">{money(c.price)}{c.old_price > c.price && <s className="ml-2 font-sans text-sm font-semibold text-slate-600">{money(c.old_price)}</s>}</p>
          <Link to={`/cursos/${c.slug}`} className="btn-primary btn-sm whitespace-nowrap" aria-label={`Ver curso ${c.title}`}>Ver curso</Link>
        </div>
      </div>
    </article>
  );
}