import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Briefcase, ChevronDown, CircleCheck, Code2, GraduationCap, Search, Star, Users } from 'lucide-react';
import { useLoad, LoadState, Stars, Empty } from '../ui.jsx';
import CourseCard from '../CourseCard.jsx';

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
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-500/90" aria-hidden="true" />
        <div className="absolute -bottom-40 right-40 h-80 w-80 rounded-full bg-navy-700" aria-hidden="true" />
        <div className="container-x relative py-16 sm:py-24">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide"><Star className="h-3.5 w-3.5 fill-white" aria-hidden="true" /> Aprende habilidades que sí aplicas</p>
          <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.08] sm:text-6xl">Impulsa tu futuro, una lección a la vez</h1>
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

      <section className="bg-brand-500 text-white">
        <div className="container-x flex flex-wrap items-center justify-between gap-6 py-14">
          <div><h2 className="text-3xl font-extrabold sm:text-4xl">Empieza hoy. Tu próximo logro te espera.</h2><p className="mt-2 text-lg text-white/90">Crea tu cuenta y aprende a tu propio ritmo.</p></div>
          <Link to="/registro" className="btn-soft">Crear mi cuenta <CircleCheck className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
