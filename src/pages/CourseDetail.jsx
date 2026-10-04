import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Award, BarChart3, Check, ChevronDown, Clock, FileText, Globe, HelpCircle, Lock, PlayCircle, Star } from 'lucide-react';
import { asset, embedUrl, fecha, money } from '../api.js';
import { useAuth } from '../auth.jsx';
import { useLoad, LoadState, Modal, Stars, Alert, PageLoader } from '../ui.jsx';
import { Cover } from '../CourseCard.jsx';
import { NotFound } from './Static.jsx';

export const LESSON_ICON = { video: PlayCircle, texto: FileText, cuestionario: HelpCircle };

export default function CourseDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const s = useLoad(`/courses/${slug}`, [user?.id]);
  const [preview, setPreview] = useState(null);
  if (s.error?.status === 404) return <NotFound />;
  return (
    <LoadState s={s}>{(c) => {
      const total = c.modules.reduce((n, m) => n + m.lessons.length, 0);
      const buy = () => nav(`/comprar/${c.slug}`);
      const Cta = () => c.enrolled ? <Link to={`/aula/${c.slug}`} className="btn-primary w-full">Ir a mi curso</Link>
        : c.pendingOrder ? <><Alert type="info">Tu pedido <b>{c.pendingOrder.code}</b> está pendiente de verificación. Te avisaremos cuando se apruebe.</Alert><Link to="/mi-cuenta/compras" className="btn-outline mt-3 w-full">Ver mis compras</Link></>
        : <button onClick={buy} className="btn-primary w-full">{c.price === 0 ? 'Inscribirme gratis' : 'Comprar curso'}</button>;
      return (
        <>
          <section className="bg-navy-900 text-white">
            <div className="container-x py-10 lg:pr-[420px]">
              {c.category && <Link to={`/cursos?category=${c.category_slug}`} className="text-sm font-bold uppercase tracking-wide text-brand-100 hover:underline">{c.category}</Link>}
              <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{c.title}</h1>
              <p className="mt-3 max-w-2xl text-lg text-navy-100">{c.short_desc}</p>
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-navy-100">
                <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{c.reviews_count ? <><b className="text-white">{c.rating}</b> ({c.reviews_count} reseñas)</> : 'Sin reseñas aún'}</span>
                {c.instructor && <span>Por <b className="text-white">{c.instructor}</b></span>}
                {c.is_demo && <span className="rounded bg-white/15 px-2 py-0.5 text-xs font-bold">Curso de demostración</span>}
              </p>
            </div>
          </section>
          <div className="container-x grid gap-8 py-8 lg:grid-cols-[1fr_360px]">
            <aside className="lg:order-2 lg:-mt-48">
              <div className="card overflow-hidden lg:sticky lg:top-24">
                <Cover src={c.image} alt={`Portada del curso ${c.title}`} className="aspect-[16/10] w-full" />
                <div className="p-5">
                  <p className="font-display text-3xl font-extrabold text-ink">{money(c.price)}{c.old_price > c.price && <s className="ml-2 font-sans text-base font-medium text-slate-400">{money(c.old_price)}</s>}</p>
                  <div className="mt-4"><Cta /></div>
                  {!c.enrolled && <p className="mt-3 flex items-start gap-2 text-xs text-slate-600"><Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />Las lecciones se desbloquean cuando tu compra es confirmada.</p>}
                  <ul className="mt-5 space-y-2.5 border-t border-slate-200 pt-4 text-sm">
                    <li className="flex items-center gap-2.5"><BarChart3 className="h-4 w-4 text-navy-700" />Nivel: {c.level}</li>
                    <li className="flex items-center gap-2.5"><Clock className="h-4 w-4 text-navy-700" />{c.duration_hours} horas · {total} lecciones</li>
                    <li className="flex items-center gap-2.5"><Globe className="h-4 w-4 text-navy-700" />Idioma: {c.language}</li>
                    <li className="flex items-start gap-2.5"><Award className="mt-0.5 h-4 w-4 shrink-0 text-navy-700" />{c.has_certificate ? 'Certificado con código QR al completar todas las lecciones y aprobar el examen.' : 'Este curso no incluye certificado.'}</li>
                  </ul>
                </div>
              </div>
            </aside>
            <div className="min-w-0 space-y-10 lg:order-1">
              {c.learn.length > 0 && <section><h2 className="text-xl font-bold">Lo que aprenderás</h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">{c.learn.map((t) => <li key={t} className="flex gap-2.5 text-[15px]"><Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />{t}</li>)}</ul></section>}
              <section><h2 className="text-xl font-bold">Acerca de este curso</h2><p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-slate-700">{c.description}</p></section>
              <section>
                <h2 className="text-xl font-bold">Temario</h2>
                <div className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200">
                  {c.modules.map((m, i) => (
                    <details key={m.id} open={i === 0} className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 font-semibold"><span>{m.title}</span><span className="flex shrink-0 items-center gap-2 text-sm font-normal text-slate-500">{m.lessons.length} lecc.<ChevronDown className="h-4 w-4 transition group-open:rotate-180" /></span></summary>
                      <ul className="border-t border-slate-200 bg-slate-50">
                        {m.lessons.map((l) => { const Icon = LESSON_ICON[l.type] || FileText; return (
                          <li key={l.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                            <Icon className="h-4 w-4 shrink-0 text-slate-500" />
                            <span className="min-w-0 flex-1">{l.title}</span>
                            {l.is_free && !c.enrolled ? <button className="font-semibold text-brand-500 hover:underline" onClick={() => setPreview(l)}>Vista previa</button> : !c.enrolled && <Lock className="h-3.5 w-3.5 text-slate-400" aria-label="Bloqueada" />}
                            {l.duration_min > 0 && <span className="w-12 text-right text-slate-500">{l.duration_min} min</span>}
                          </li>); })}
                      </ul>
                    </details>))}
                </div>
              </section>
              <div className="grid gap-8 sm:grid-cols-2">
                {c.requirements.length > 0 && <section><h2 className="text-xl font-bold">Requisitos</h2><ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] text-slate-700">{c.requirements.map((t) => <li key={t}>{t}</li>)}</ul></section>}
                {c.includes.length > 0 && <section><h2 className="text-xl font-bold">Este curso incluye</h2><ul className="mt-3 space-y-1.5 text-[15px] text-slate-700">{c.includes.map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{t}</li>)}</ul></section>}
              </div>
              {c.instructor && <section><h2 className="text-xl font-bold">Instructor</h2>
                <div className="mt-3 flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 font-display text-lg font-bold text-white">{c.instructor.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>
                  <div><b>{c.instructor}</b><p className="text-sm text-slate-600">{c.instructor_title}</p></div></div></section>}
              <section>
                <h2 className="text-xl font-bold">Opiniones de estudiantes</h2>
                {c.reviews.length ? (
                  <><p className="mt-2 flex items-center gap-2"><b className="font-display text-3xl">{c.rating}</b><Stars value={c.rating} size="h-5 w-5" /><span className="text-sm text-slate-600">{c.reviews_count} reseñas</span></p>
                    <ul className="mt-4 space-y-4">{c.reviews.map((r) => (
                      <li key={r.id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><b>{r.name}</b><span className="text-xs text-slate-500">{fecha(r.created_at)}</span></div><Stars value={r.rating} />{r.comment && <p className="mt-1.5 text-[15px] text-slate-700">{r.comment}</p>}</li>))}</ul></>
                ) : <p className="mt-2 text-slate-600">Este curso todavía no tiene reseñas.</p>}
              </section>
            </div>
          </div>
          <div className="sticky bottom-0 z-30 border-t border-slate-200 bg-white p-3 lg:hidden">{c.enrolled ? <Link to={`/aula/${c.slug}`} className="btn-primary w-full">Ir a mi curso</Link> : !c.pendingOrder && <button onClick={buy} className="btn-primary w-full">{c.price === 0 ? 'Inscribirme gratis' : `Comprar por ${money(c.price)}`}</button>}</div>
          {preview && <Modal wide title={`Vista previa: ${preview.title}`} onClose={() => setPreview(null)}><Preview id={preview.id} /></Modal>}
        </>
      );
    }}</LoadState>
  );
}

function Preview({ id }) {
  const s = useLoad(`/lessons/${id}`);
  if (s.loading) return <PageLoader />;
  if (s.error) return <Alert>{s.error.message}</Alert>;
  return <LessonBody lesson={s.data} />;
}
export function LessonBody({ lesson, onEnded }) {
  const v = lesson.video, embed = v && v.kind !== 'file' ? embedUrl(v.url) : null;
  return (
    <div className="space-y-5">
      {lesson.type === 'video' && (v ? (
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
          {v.kind === 'file' ? <video key={v.url} src={asset(v.url)} controls controlsList="nodownload" playsInline onEnded={onEnded} className="h-full w-full" />
            : embed ? <iframe src={embed} title={lesson.title} allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="h-full w-full" />
            : <a href={v.url} target="_blank" rel="noreferrer" className="flex h-full items-center justify-center text-white underline">Abrir el video en una pestaña nueva</a>}
        </div>
      ) : <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl bg-navy-900 px-6 text-center text-navy-100"><PlayCircle className="h-12 w-12" /><p className="mt-3 font-semibold text-white">El video de esta lección aún no fue subido</p><p className="text-sm">El administrador puede agregarlo desde el panel.</p></div>)}
      {lesson.content && lesson.type !== 'cuestionario' && <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-700">{lesson.content}</p>}
    </div>
  );
}
