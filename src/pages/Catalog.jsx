import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SearchX, SlidersHorizontal } from 'lucide-react';
import { useLoad, LoadState, Empty } from '../ui.jsx';
import CourseCard from '../CourseCard.jsx';

const FILTERS = [
  ['level', 'Nivel', [['', 'Todos'], ['Principiante', 'Principiante'], ['Intermedio', 'Intermedio'], ['Avanzado', 'Avanzado'], ['Todos los niveles', 'Todos los niveles']]],
  ['maxPrice', 'Precio', [['', 'Cualquiera'], ['100', 'Hasta S/ 100'], ['150', 'Hasta S/ 150'], ['200', 'Hasta S/ 200']]],
  ['duration', 'Duración', [['', 'Cualquiera'], ['corta', 'Hasta 6 h'], ['media', '6 a 15 h'], ['larga', 'Más de 15 h']]],
  ['rating', 'Calificación', [['', 'Cualquiera'], ['4', '4 estrellas o más'], ['4.5', '4.5 o más']]],
];
export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [text, setText] = useState(params.get('q') || '');
  const [show, setShow] = useState(false);
  const cats = useLoad('/categories');
  const courses = useLoad(`/courses?${params.toString()}`);
  useEffect(() => setText(params.get('q') || ''), [params]);
  const set = (k, v) => { const p = new URLSearchParams(params); v ? p.set(k, v) : p.delete(k); setParams(p, { replace: true }); };
  const active = [...params.keys()].filter((k) => k !== 'sort').length;
  return (
    <div className="container-x py-10">
      <p className="eyebrow">Catálogo</p>
      <h1 className="h-section mt-1">Todos los cursos</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <form onSubmit={(e) => { e.preventDefault(); set('q', text.trim()); }} role="search" className="flex min-w-0 flex-1 basis-72 gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input className="input pl-9" value={text} onChange={(e) => setText(e.target.value)} placeholder="Busca por curso, tema o instructor" aria-label="Buscar cursos" />
          </div>
          <button className="btn-primary">Buscar</button>
        </form>
        <button className="btn-outline lg:hidden" onClick={() => setShow(!show)} aria-expanded={show}><SlidersHorizontal className="h-4 w-4" /> Filtros{active ? ` (${active})` : ''}</button>
        <select className="input w-auto" aria-label="Ordenar" value={params.get('sort') || ''} onChange={(e) => set('sort', e.target.value)}>
          <option value="">Más populares</option><option value="recientes">Más recientes</option><option value="precio_asc">Precio: menor a mayor</option><option value="precio_desc">Precio: mayor a menor</option>
        </select>
      </div>
      <div className="mt-6 grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside className={`${show ? 'grid' : 'hidden'} grid-cols-2 gap-4 self-start lg:grid lg:grid-cols-1`} aria-label="Filtros">
          <label className="block"><span className="label">Categoría</span>
            <select className="input" value={params.get('category') || ''} onChange={(e) => set('category', e.target.value)}>
              <option value="">Todas</option>{cats.data?.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select></label>
          {FILTERS.map(([key, label, opts]) => (
            <label key={key} className="block"><span className="label">{label}</span>
              <select className="input" value={params.get(key) || ''} onChange={(e) => set(key, e.target.value)}>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>))}
          {active > 0 && <button className="btn-outline btn-sm col-span-2 lg:col-span-1" onClick={() => setParams(params.get('sort') ? { sort: params.get('sort') } : {})}>Limpiar filtros</button>}
        </aside>
        <LoadState s={courses}>{(list) => list.length ? (
          <div><p className="mb-4 text-sm text-slate-600" aria-live="polite">{list.length} {list.length === 1 ? 'curso encontrado' : 'cursos encontrados'}</p>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{list.map((c) => <CourseCard key={c.id} c={c} />)}</div></div>
        ) : (
          <Empty icon={SearchX} title="No encontramos cursos con esa búsqueda">Prueba con otras palabras o quita algunos filtros.
            <button className="btn-outline btn-sm mx-auto mt-4 flex" onClick={() => setParams({})}>Ver todos los cursos</button></Empty>)}
        </LoadState>
      </div>
    </div>
  );
}
