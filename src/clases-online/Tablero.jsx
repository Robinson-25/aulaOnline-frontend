// Tablero: tarjetas de los cursos en vivo y, a la derecha, "Por hacer" y "Valoración reciente".
import { Link } from 'react-router-dom';
import { Check, ClipboardList, Megaphone, MessagesSquare, MoreVertical, Radio } from 'lucide-react';
import { CLASES, POR_HACER, VALORACIONES, DESCUENTO_ESTUDIANTES } from './datos-prueba.js';

export default function Tablero() {
  return (
    <div className="mx-auto flex max-w-[1500px] flex-col gap-10 px-5 py-6 sm:px-8 xl:flex-row">
      <main className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 pb-4">
          <h1 className="font-display text-4xl font-extrabold text-ink">Tablero</h1>
          <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">¿Compraste un curso grabado? {DESCUENTO_ESTUDIANTES}% de descuento en tu matrícula.</p>
        </div>
        <div className="mt-7 grid gap-8 sm:grid-cols-2 2xl:grid-cols-3">{CLASES.map((c) => (
          <article key={c.slug} className="overflow-hidden rounded border border-slate-300 bg-white shadow-md transition hover:shadow-xl">
            <Link to={`/clases-en-vivo/${c.slug}`} aria-label={c.title} className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${c.tone}`}>
              <Radio className="h-16 w-16 text-white/30" aria-hidden="true" />
              <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded bg-white px-2 py-1 text-xs font-bold uppercase text-brand-600"><span className="h-2 w-2 rounded-full bg-brand-500" />En vivo</span>
              <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-slate-800/80 text-white"><MoreVertical className="h-5 w-5" aria-hidden="true" /></span>
            </Link>
            <div className="p-4">
              <h2 className="truncate text-lg font-bold text-navy-900"><Link to={`/clases-en-vivo/${c.slug}`} className="hover:underline">{c.title}</Link></h2>
              <p className="text-lg text-slate-700">{c.code}</p>
              <p className="text-sm italic text-slate-700">{c.period}</p>
              <div className="mt-3 flex gap-8 text-slate-700">{[[ClipboardList, 'Tareas'], [MessagesSquare, 'Foros'], [Megaphone, 'Anuncios']].map(([Icon, t]) =>
                <Link key={t} to={`/clases-en-vivo/${c.slug}/modulos`} aria-label={`${t} de ${c.title}`} title={t} className="hover:text-brand-500"><Icon className="h-6 w-6" /></Link>)}</div>
            </div>
          </article>))}</div>
      </main>
      <aside className="shrink-0 xl:w-[300px]">
        <p className="font-display text-3xl font-extrabold text-navy-900">Aula <span className="text-brand-500">Pro</span> <span className="font-semibold italic text-sky-600">Virtual</span></p>
        <h2 className="mt-6 border-b border-slate-300 pb-2 text-lg font-bold text-ink">Por hacer</h2>
        <ul className="mt-3 space-y-4">{POR_HACER.map((t) => (
          <li key={t.title} className="flex gap-3"><ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" aria-hidden="true" />
            <div className="min-w-0"><Link to={`/clases-en-vivo/${t.slug}/modulos`} className="block truncate font-semibold text-sky-700 underline">{t.title}</Link>
              <p className="text-[15px] text-ink">{t.course}</p><p className="text-[15px] text-ink">{t.pts} puntos | {t.due}</p></div></li>))}</ul>
        <h2 className="mt-8 border-b border-slate-300 pb-2 text-lg font-bold text-ink">Valoración reciente</h2>
        <ul className="mt-3 space-y-4">{VALORACIONES.map((v) => (
          <li key={v.title} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
            <div><p className="font-semibold text-sky-700">{v.title}</p><p className="text-sm text-slate-700">{v.course}</p><p className="text-sm font-bold text-ink">{v.nota}</p></div></li>))}</ul>
      </aside>
    </div>
  );
}
