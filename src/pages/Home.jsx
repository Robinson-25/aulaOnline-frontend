import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Briefcase, ChevronDown, Code2, GraduationCap, PlayCircle, Search, Star, Users } from 'lucide-react';
import { useLoad, LoadState, Stars, Empty } from '../ui.jsx';
import CourseCard from '../CourseCard.jsx';
import hero from '../assets/hero.png';

export const CAT_ICONS = { maletin: Briefcase, codigo: Code2, personas: Users, birrete: GraduationCap, libro: BookOpen };
const STEPS = ['Elige el curso ideal', 'Realiza tu compra de forma segura', 'Encuéntralo en tu cuenta y aprende a tu ritmo', 'Completa tus lecciones y el examen', 'Obtén tu certificado verificable'];
const FAQ = [
  ['¿Puedo aprender desde mi celular?', 'Sí. La plataforma se adapta a celulares, tabletas y computadoras, y tu avance se guarda automáticamente.'],
  ['¿Los cursos incluyen certificado?', 'Los cursos que lo indican entregan un certificado en PDF con código QR al completar todas las lecciones y aprobar el examen final.'],
  ['¿Cómo accedo después de comprar?', 'Cuando tu pago es confirmado, el curso aparece en "Mi cuenta → Mis cursos" y puedes empezar de inmediato.'],
  ['¿Qué métodos de pago aceptan?', 'En la pantalla de compra verás los métodos habilitados (por ejemplo Yape, Plin o transferencia) con las instrucciones para pagar.'],
];

export default function Home() {
  const nav = useNavigate();
  const [text, setText] = useState('');
  const cats = useLoad('/categories'), popular = useLoad('/courses'), recent = useLoad('/courses?sort=recientes'), featured = useLoad('/reviews/featured');
  const search = (e) => { e.preventDefault(); nav(`/cursos${text.trim() ? `?q=${encodeURIComponent(text.trim())}` : ''}`); };
  const demo = popular.data?.some((c) => c.is_demo);
  const quote = featured.data?.[0];
  return (
    <>
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-navy-700/60" aria-hidden="true" />
        <div className="container-x relative grid grid-cols-1 items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr]">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide"><Star className="h-3.5 w-3.5 fill-white" aria-hidden="true" /> Aprende habilidades que sí aplicas</p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] sm:text-5xl xl:text-6xl">Impulsa tu futuro, una lección a la vez</h1>
            <p className="mt-5 max-w-xl text-lg text-navy-100">Cursos claros, prácticos y creados por profesionales que conocen el mercado latinoamericano.</p>
            <form onSubmit={search} role="search" className="mt-8 flex max-w-xl items-center gap-2 rounded-xl bg-white p-2 shadow-lg">
              <Search className="ml-2 h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
              <input value={text} onChange={(e) => setText(e.target.value)} aria-label="Buscar cursos" placeholder="Busca por curso, tema o instructor" className="min-w-0 flex-1 bg-transparent px-1 py-2 text-ink placeholder:text-slate-500 focus:outline-none" />
              <button className="btn-primary">Buscar</button>
            </form>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/cursos" className="btn-primary">Explorar cursos <ArrowRight className="h-4 w-4" /></Link>
              <a href="#como-funciona" className="btn-soft">Cómo funciona</a>
            </div>
          </div>

          {/* Foto principal con marco, bloque rojo de fondo y tarjetas flotantes */}
          <div className="relative mx-auto w-[calc(100%-1.5rem)] max-w-md sm:w-full lg:max-w-none">
            <div className="absolute -right-3 -top-3 h-full w-full rounded-[28px] bg-brand-500 sm:-right-5 sm:-top-5" aria-hidden="true" />
            <div className="absolute -bottom-6 -left-6 hidden h-28 w-28 rounded-full border-[10px] border-navy-700 sm:block" aria-hidden="true" />
            <img src={hero} alt="Estudiante sonriendo mientras toma un curso en su laptop" className="relative aspect-[4/3] w-full rounded-[28px] object-cover object-[70%_center] shadow-2xl ring-1 ring-white/10 lg:aspect-[5/4]" />
            <div className="absolute -left-3 bottom-6 flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-ink shadow-xl sm:-left-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-500"><Award className="h-5 w-5" aria-hidden="true" /></span>
              <span className="text-sm leading-tight"><b className="block">Certificado verificable</b><span className="text-slate-600">con código QR</span></span>
            </div>
            <div className="absolute -right-2 top-6 hidden items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white shadow-xl ring-1 ring-white/15 sm:flex">
              <PlayCircle className="h-4 w-4 text-brand-100" aria-hidden="true" /> Aprende a tu ritmo
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="eyebrow">Explora por área</p><h2 className="h-section mt-1">Encuentra tu próximo reto</h2></div>
          <Link to="/cursos" className="flex items-center gap-1.5 font-semibold text-brand-500 hover:underline">Ver todo <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <LoadState s={cats}>{(list) => (
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((c) => { const Icon = CAT_ICONS[c.icon] || BookOpen; return (
              <Link key={c.id} to={`/cursos?category=${c.slug}`} className="card flex items-center gap-4 p-5 transition hover:border-brand-500">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-navy-900"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                <span><b className="block text-lg leading-tight">{c.name}</b><span className="text-sm text-slate-600">{c.courses} {c.courses === 1 ? 'curso' : 'cursos'}</span></span>
              </Link>); })}
          </div>)}
        </LoadState>
      </section>

      <section className="bg-slate-100 py-14">
        <div className="container-x">
          <div className="text-center"><p className="eyebrow">Más elegidos</p><h2 className="h-section mt-1">Cursos que abren oportunidades</h2>
            {demo && <p className="mt-2 text-slate-600">Contenido de demostración para conocer la experiencia de la plataforma.</p>}</div>
          <LoadState s={popular}>{(list) => list.length
            ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.slice(0, 3).map((c) => <CourseCard key={c.id} c={c} />)}</div>
            : <div className="mt-8"><Empty title="Pronto habrá cursos disponibles">Vuelve en unos días para ver las novedades.</Empty></div>}
          </LoadState>
        </div>
      </section>

      {popular.data && recent.data?.filter((c) => !popular.data.slice(0, 3).some((x) => x.id === c.id)).length > 0 && (
        <section className="container-x py-14">
          <p className="eyebrow">Recién publicados</p><h2 className="h-section mt-1">Cursos nuevos</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{recent.data.filter((c) => !popular.data.slice(0, 3).some((x) => x.id === c.id)).slice(0, 3).map((c) => <CourseCard key={c.id} c={c} />)}</div>
        </section>
      )}

      <section id="como-funciona" className="scroll-mt-20 border-t border-slate-200 py-14">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Simple y directo</p><h2 className="h-section mt-1">Tu ruta para seguir creciendo</h2>
            <ol className="mt-7 space-y-5">{STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-4 text-lg font-semibold"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-base text-white">{i + 1}</span>{s}</li>))}
            </ol>
          </div>
          <figure className="rounded-xl bg-navy-900 p-8 text-white sm:p-10">
            <BookOpen className="h-11 w-11 text-brand-100" aria-hidden="true" />
            {quote ? (
              <>
                <blockquote className="mt-6 font-display text-2xl font-bold leading-snug">“{quote.comment}”</blockquote>
                <figcaption className="mt-6 flex flex-wrap items-end justify-between gap-3">
                  <span><b className="block text-lg">{quote.name}</b><span className="text-sm text-navy-200">Estudiante de {quote.course}</span></span>
                  <Stars value={quote.rating} size="h-6 w-6" />
                </figcaption>
              </>
            ) : <p className="mt-6 font-display text-2xl font-bold leading-snug">Aprende a tu ritmo, practica con casos reales y demuestra lo que sabes con un certificado verificable.</p>}
          </figure>
        </div>
      </section>

      <section id="preguntas" className="container-x scroll-mt-20 py-14">
        <h2 className="h-section text-center">Preguntas frecuentes</h2>
        <div className="mx-auto mt-6 max-w-3xl divide-y divide-slate-200 border-b border-slate-200">
          {FAQ.map(([qq, a]) => (
            <details key={qq} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[17px] font-semibold">{qq}<ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" aria-hidden="true" /></summary>
              <p className="pb-5 text-slate-600">{a}</p>
            </details>))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-[#0B3A7A] via-[#1552B8] to-[#2F7BF0] text-white">
        {/* Borde superior curvo */}
        <svg className="absolute inset-x-0 top-0 h-10 w-full text-white sm:h-16" viewBox="0 0 1440 80" preserveAspectRatio="none" fill="currentColor" aria-hidden="true"><path d="M0 0h1440v30C1200 85 960 85 720 45S240 5 0 55z" /></svg>
        <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute right-[8%] top-1/3 hidden h-20 w-20 rounded-full border-[10px] border-white/15 lg:block" aria-hidden="true" />
        <div className="absolute left-[10%] top-1/2 hidden h-4 w-4 rounded-full bg-amber-300 lg:block" aria-hidden="true" />
        <div className="absolute bottom-10 right-[22%] hidden h-3 w-3 rounded-full bg-white/60 lg:block" aria-hidden="true" />
        <div className="container-x relative flex flex-col items-center pb-16 pt-24 text-center sm:pb-20 sm:pt-32">
          <h2 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl">Tu próximo logro <span className="text-amber-300">empieza hoy</span></h2>
          <Link to="/registro" className="group mt-8 inline-flex items-center gap-3 rounded-full bg-amber-400 py-2.5 pl-8 pr-2.5 text-lg font-bold text-navy-950 shadow-xl shadow-black/20 transition hover:bg-amber-300">
            Crear mi cuenta
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-950 text-white transition group-hover:translate-x-1"><ArrowRight className="h-5 w-5" /></span>
          </Link>
        </div>
      </section>
    </>
  );
}