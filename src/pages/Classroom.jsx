import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Award, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Circle, CircleDot, Download, ListTree, Pencil, Trash2, X } from 'lucide-react';
import { api, asset, fecha } from '../api.js';
import { useLoad, PageLoader, Alert, Button, Stars, Badge, useToast, Empty } from '../ui.jsx';
import { LESSON_ICON, LessonBody } from './CourseDetail.jsx';
import { Forbidden, NotFound } from './Static.jsx';

export default function Classroom() {
  const { slug, lessonId } = useParams(), nav = useNavigate(), toast = useToast();
  const course = useLoad(`/learn/${slug}`);
  const [menu, setMenu] = useState(false), [tab, setTab] = useState('resumen');
  const c = course.data;
  const flat = c ? c.modules.flatMap((m) => m.lessons) : [];
  const currentId = Number(lessonId) || c?.last_lesson_id || flat.find((l) => l.status !== 'completada')?.id || flat[0]?.id;
  const lesson = useLoad(currentId ? `/lessons/${currentId}` : null);
  useEffect(() => { setMenu(false); setTab('resumen'); window.scrollTo(0, 0); }, [currentId]);

  if (course.error) return course.error.status === 404 ? <NotFound /> : course.error.status === 403
    ? <div><Forbidden /><p className="-mt-10 pb-10 text-center"><Link className="font-semibold text-brand-500 underline" to={`/cursos/${slug}`}>Ver la página del curso</Link></p></div>
    : <div className="p-8"><Alert>{course.error.message}</Alert></div>;
  if (!c) return <PageLoader />;
  const idx = flat.findIndex((l) => l.id === currentId), prev = flat[idx - 1], next = flat[idx + 1], cur = flat[idx];
  const go = (l) => l && nav(`/aula/${slug}/${l.id}`);
  const onDone = (r) => { course.reload(); if (r.certificate && !c.certificate) toast.ok('¡Felicitaciones! Completaste el curso y tu certificado está listo.'); };
  const complete = async () => { try { onDone(await api(`/lessons/${currentId}/complete`, { method: 'POST' })); toast.ok('Lección completada.'); } catch (e) { toast.error(e.message); } };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 bg-navy-900 px-3 text-white sm:px-5">
        <Link to="/mi-cuenta" aria-label="Volver a mis cursos" className="rounded-lg p-2 hover:bg-white/10"><ArrowLeft className="h-5 w-5" /></Link>
        <p className="min-w-0 flex-1 truncate font-semibold">{c.title}</p>
        <p className="hidden shrink-0 text-sm sm:block">Tu progreso <b>{c.progress.done}</b> de <b>{c.progress.total}</b> ({c.progress.percent}%)</p>
        <b className="text-sm sm:hidden">{c.progress.percent}%</b>
        <button className="rounded-lg p-2 hover:bg-white/10 lg:hidden" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Contenido del curso">{menu ? <X className="h-5 w-5" /> : <ListTree className="h-5 w-5" />}</button>
      </header>
      <div className="h-1 bg-navy-800"><div className="h-full bg-brand-500 transition-all" style={{ width: `${c.progress.percent}%` }} /></div>
      <div className="flex flex-1">
        <aside className={`${menu ? 'fixed inset-x-0 bottom-0 top-[60px] z-30 block' : 'hidden'} w-full shrink-0 overflow-y-auto border-r border-slate-200 bg-white lg:sticky lg:top-[60px] lg:block lg:h-[calc(100vh-60px)] lg:w-80`} aria-label="Contenido del curso">
          <p className="border-b border-slate-200 px-4 py-3.5 font-display font-bold">Contenido del curso</p>
          {c.modules.map((m) => {
            const done = m.lessons.filter((l) => l.status === 'completada').length;
            return (
              <details key={m.id} open={m.lessons.some((l) => l.id === currentId) || undefined} className="group border-b border-slate-200">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3.5 text-[15px] font-semibold"><span>{m.title}</span><span className="flex shrink-0 items-center gap-1.5 text-xs font-normal text-slate-500">{done}/{m.lessons.length}<ChevronDown className="h-4 w-4 transition group-open:rotate-180" /></span></summary>
                <ul>{m.lessons.map((l) => { const Icon = LESSON_ICON[l.type]; const on = l.id === currentId; return (
                  <li key={l.id}><Link to={`/aula/${slug}/${l.id}`} aria-current={on ? 'page' : undefined} className={`flex items-center gap-2.5 px-4 py-3 text-sm ${on ? 'bg-navy-50 font-semibold text-navy-900' : 'hover:bg-slate-50'}`}>
                    <Icon className={`h-4 w-4 shrink-0 ${on ? 'text-brand-500' : 'text-slate-500'}`} /><span className="min-w-0 flex-1">{l.title}</span>
                    {l.duration_min > 0 && <span className="text-xs text-slate-500">{l.duration_min} min</span>}
                    {l.status === 'completada' ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-label="Completada" /> : l.status === 'en_progreso' ? <CircleDot className="h-5 w-5 shrink-0 text-amber-500" aria-label="En progreso" /> : <Circle className="h-5 w-5 shrink-0 text-slate-300" aria-label="Pendiente" />}
                  </Link></li>); })}</ul>
              </details>);
          })}
        </aside>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            {!next && !c.certificate && flat.some((l) => l.status !== 'completada') && cur?.status === 'completada' && (() => { const falta = flat.filter((l) => l.status !== 'completada'); return (
              <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4">
                <p className="font-bold text-amber-900">Ya casi terminas: te falta completar {falta.length} lección(es) para {c.has_certificate ? 'recibir tu certificado' : 'terminar el curso'}.</p>
                <ul className="mt-3 space-y-2">{falta.map((l) => <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-white px-3 py-2 text-[15px] font-medium text-ink"><span>{l.title}<span className="block text-xs font-semibold text-slate-600">{c.modules.find((m) => m.lessons.some((x) => x.id === l.id))?.title}</span></span><button className="btn-navy btn-sm" onClick={() => go(l)}>Ir a la lección<ChevronRight className="h-4 w-4" /></button></li>)}</ul>
              </div>); })()}
            {c.certificate && !c.certificate.revoked && (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="flex items-center gap-2.5 font-semibold text-emerald-900"><Award className="h-6 w-6" />¡Completaste el curso! Tu certificado está listo.</p>
              </div>)}
            {!flat.length ? <Empty title="Este curso todavía no tiene lecciones">Vuelve pronto: el instructor está preparando el contenido.</Empty>
              : lesson.loading && !lesson.data ? <PageLoader /> : lesson.error ? <Alert>{lesson.error.message}</Alert> : lesson.data && (
              <>
                <p className="text-sm font-semibold capitalize text-slate-500">{lesson.data.type === 'texto' ? 'Lectura' : lesson.data.type}</p>
                <h1 className="mb-4 text-2xl font-extrabold">{lesson.data.title}</h1>
                {lesson.data.type === 'cuestionario' ? <Quiz key={lesson.data.id} lesson={lesson.data} passed={cur?.status === 'completada'} onDone={(r) => { onDone(r); lesson.reload(); }} /> : <LessonBody lesson={lesson.data} onEnded={() => cur?.status !== 'completada' && complete()} />}
                {lesson.data.resources.length > 0 && (
                  <section className="mt-6"><h2 className="font-bold">Materiales de la lección</h2>
                    <ul className="mt-2 space-y-2">{lesson.data.resources.map((r) => <li key={r.url}><a href={asset(r.url)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-navy-700 hover:underline"><Download className="h-4 w-4" />{r.name}</a></li>)}</ul></section>)}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                  <button className="btn-outline" disabled={!prev} onClick={() => go(prev)}><ChevronLeft className="h-4 w-4" />Anterior</button>
                  {lesson.data.type !== 'cuestionario' && (cur?.status === 'completada'
                    ? <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700"><Check className="h-4 w-4" />Completada</span>
                    : <button className="btn-navy" onClick={complete}><Check className="h-4 w-4" />Marcar como completada</button>)}
                  {!next && c.certificate && !c.certificate.revoked
                    ? <Link to="/mi-cuenta/certificados" className="btn-primary"><Award className="h-4 w-4" />Mis certificados</Link>
                    : !next && c.progress.done >= c.progress.total ? <Link to="/mi-cuenta" className="btn-primary">Finalizar curso<ChevronRight className="h-4 w-4" /></Link>
                    : <button className="btn-primary" disabled={!next} onClick={() => go(next)}>Siguiente<ChevronRight className="h-4 w-4" /></button>}
                </div>
                <div className="mt-8 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-card"><div className="flex flex-wrap gap-1 border-b border-slate-300 bg-slate-50 px-2" role="tablist">
                  {[['resumen', 'Resumen'], ['preguntas', 'Preguntas y respuestas'], ['resena', 'Mi reseña']].map(([id, l]) => (
                    <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`-mb-px border-b-[3px] px-4 py-3 text-[15px] font-bold ${tab === id ? 'border-brand-500 bg-white text-brand-600' : 'border-transparent text-slate-800 hover:text-brand-600'}`}>{l}</button>))}
                </div>
                <div className="p-5">
                  {tab === 'resumen' && <p className="text-base font-medium text-ink">Lección {idx + 1} de {flat.length} · Curso de {c.instructor || 'la plataforma'}. {c.has_certificate ? 'Completa todas las lecciones y aprueba el examen para obtener tu certificado.' : ''}</p>}
                  {tab === 'preguntas' && <QA key={currentId} lessonId={currentId} />}
                  {tab === 'resena' && <Review course={c} onSaved={course.reload} />}
                </div></div>
              </>)}
          </div>
        </main>
      </div>
    </div>
  );
}

function Quiz({ lesson, passed, onDone }) {
  const [started, setStarted] = useState(false), [answers, setAnswers] = useState({}), [result, setResult] = useState(null), [error, setError] = useState(''), [loading, setLoading] = useState(false);
  const send = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { const r = await api(`/lessons/${lesson.id}/quiz`, { method: 'POST', body: { answers } }); setResult(r); onDone(r); window.scrollTo(0, 0); } catch (er) { setError(er.message); } finally { setLoading(false); }
  };
  if (!lesson.questions.length) return <Empty title="Este cuestionario aún no tiene preguntas" />;
  if (!started || result) return (
    <div className="card p-5">
      {result && <div className="mb-4"><Alert type={result.passed ? 'ok' : 'error'}><b>{result.passed ? '¡Aprobaste!' : 'No alcanzaste la nota mínima.'}</b> Obtuviste {result.correct} de {result.total} ({result.percent}%). {!result.passed && 'Repasa las lecciones e inténtalo de nuevo.'}</Alert></div>}
      <p className="text-[15px] text-slate-700">{lesson.content}</p>
      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 border-y border-slate-200 py-4 text-sm">
        <div><dt className="inline text-slate-600">Preguntas: </dt><dd className="inline font-bold">{lesson.questions.length}</dd></div>
        {lesson.duration_min > 0 && <div><dt className="inline text-slate-600">Tiempo sugerido: </dt><dd className="inline font-bold">{lesson.duration_min} minutos</dd></div>}
        <div><dt className="inline text-slate-600">Nota para aprobar: </dt><dd className="inline font-bold">{lesson.pass_percent}%</dd></div>
        <div><dt className="inline text-slate-600">Estado: </dt><dd className="inline">{passed ? <Badge tone="aprobada">Aprobado</Badge> : <Badge tone="pendiente">Pendiente</Badge>}</dd></div>
      </dl>
      {lesson.attempts.length > 0 && (
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[420px]"><thead><tr className="border-b border-slate-200"><th className="th">Fecha</th><th className="th">Correctas</th><th className="th">Puntos</th><th className="th">Resultado</th></tr></thead>
          <tbody>{lesson.attempts.map((a, i) => <tr key={i} className="border-b border-slate-100"><td className="td">{fecha(a.created_at)}</td><td className="td">{a.correct} de {a.total}</td><td className="td">{Math.round((a.correct / a.total) * 100)}%</td><td className="td"><Badge tone={a.passed ? 'aprobada' : 'rechazada'}>{a.passed ? 'Aprobado' : 'Desaprobado'}</Badge></td></tr>)}</tbody></table></div>)}
      <button className="btn-primary mt-5" onClick={() => { setAnswers({}); setResult(null); setStarted(true); }}>{lesson.attempts.length || result ? 'Volver a intentar' : 'Iniciar el cuestionario'}</button>
    </div>);
  return (
    <form onSubmit={send} className="space-y-5">
      {lesson.questions.map((qq, i) => (
        <fieldset key={qq.id} className="card p-5">
          <legend className="float-left mb-3 w-full font-semibold">{i + 1}. {qq.text}</legend>
          <div className="clear-both space-y-2">{qq.options.map((o, oi) => (
            <label key={oi} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-[15px] ${answers[qq.id] === oi ? 'border-navy-700 bg-navy-50' : 'border-slate-200 hover:bg-slate-50'}`}>
              <input type="radio" name={`q${qq.id}`} className="h-4 w-4 accent-[#00275B]" checked={answers[qq.id] === oi} onChange={() => setAnswers({ ...answers, [qq.id]: oi })} />{o}</label>))}</div>
        </fieldset>))}
      <Alert>{error}</Alert>
      <div className="flex flex-wrap gap-3"><Button loading={loading} className="btn-primary">Enviar respuestas</Button><button type="button" className="btn-outline" onClick={() => setStarted(false)}>Cancelar</button></div>
    </form>);
}

function QA({ lessonId }) {
  const s = useLoad(`/lessons/${lessonId}/qa`), toast = useToast();
  const [text, setText] = useState(''), [edit, setEdit] = useState(null), [busy, setBusy] = useState(false);
  const save = async (e) => {
    e.preventDefault(); setBusy(true);
    try { await api(edit ? `/qa/${edit}` : `/lessons/${lessonId}/qa`, { method: edit ? 'PUT' : 'POST', body: { question: text } }); setText(''); setEdit(null); toast.ok(edit ? 'Pregunta actualizada.' : 'Pregunta enviada.'); s.reload(); } catch (er) { toast.error(er.message); } finally { setBusy(false); }
  };
  const del = async (q) => { if (await toast.confirm('Eliminar pregunta', '¿Deseas eliminar tu pregunta?', 'Sí, eliminar')) try { await api(`/qa/${q.id}`, { method: 'DELETE' }); s.reload(); } catch (er) { toast.error(er.message); } };
  return (
    <div>
      <form onSubmit={save} className="space-y-3">
        <label className="label !text-base !font-bold !text-ink" htmlFor="pregunta">{edit ? 'Editar mi pregunta' : 'Haz una pregunta sobre esta lección'}</label>
        <textarea id="pregunta" className="input min-h-[90px] !border-slate-400 placeholder:!text-slate-500" value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe tu duda…" required />
        <div className="flex gap-2"><Button loading={busy} className="btn-navy btn-sm">{edit ? 'Guardar cambios' : 'Enviar pregunta'}</Button>{edit && <button type="button" className="btn-outline btn-sm" onClick={() => { setEdit(null); setText(''); }}>Cancelar</button>}</div>
      </form>
      <div className="mt-6 space-y-4">
        {s.loading ? <PageLoader /> : s.error ? <Alert>{s.error.message}</Alert> : !s.data.length ? <p className="text-[15px] font-medium text-slate-800">Aún no hay preguntas en esta lección. ¡Sé la primera persona en preguntar!</p> : s.data.map((q) => (
          <article key={q.id} className="card !border-slate-300 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[15px]"><b className="text-ink">{q.name}{q.mine && ' (tú)'}</b><span className="font-medium text-slate-700">{fecha(q.created_at)}</span></div>
            <p className="mt-1.5 whitespace-pre-line text-base text-ink">{q.question}</p>
            {q.answer ? <div className="mt-3 rounded-lg border border-navy-200 border-l-4 border-l-navy-700 bg-navy-50 p-3"><p className="text-sm font-bold text-navy-900">Respuesta de {q.answered_by} · {fecha(q.answered_at)}</p><p className="mt-1 whitespace-pre-line text-base text-ink">{q.answer}</p></div>
              : <div className="mt-2 flex items-center gap-3 text-sm"><span className="font-medium text-slate-700">Esperando respuesta del instructor</span>{q.mine && <><button className="flex items-center gap-1 font-semibold text-navy-700 hover:underline" onClick={() => { setEdit(q.id); setText(q.question); document.getElementById('pregunta').focus(); }}><Pencil className="h-3.5 w-3.5" />Editar</button><button className="flex items-center gap-1 font-semibold text-red-700 hover:underline" onClick={() => del(q)}><Trash2 className="h-3.5 w-3.5" />Eliminar</button></>}</div>}
          </article>))}
      </div>
    </div>);
}

function Review({ course, onSaved }) {
  const toast = useToast();
  const [rating, setRating] = useState(course.myReview?.rating || 0), [comment, setComment] = useState(course.myReview?.comment || ''), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const save = async (e) => { e.preventDefault(); setError(''); setBusy(true); try { await api(`/courses/${course.id}/review`, { method: 'POST', body: { rating, comment } }); toast.ok('¡Gracias! Tu reseña fue guardada.'); onSaved(); } catch (er) { setError(er.message); } finally { setBusy(false); } };
  return (
    <form onSubmit={save} className="max-w-xl space-y-3">
      <p className="label !text-base !font-bold !text-ink">{course.myReview ? 'Edita tu reseña' : '¿Qué te pareció el curso?'}</p>
      <Stars value={rating} onChange={setRating} size="h-8 w-8" />
      <textarea className="input min-h-[90px] !border-slate-400 placeholder:!text-slate-500" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Cuenta tu experiencia (opcional)" aria-label="Comentario" maxLength={1000} />
      <Alert>{error}</Alert>
      <Button loading={busy} disabled={!rating} className="btn-navy btn-sm">{course.myReview ? 'Actualizar reseña' : 'Publicar reseña'}</Button>
    </form>);
}