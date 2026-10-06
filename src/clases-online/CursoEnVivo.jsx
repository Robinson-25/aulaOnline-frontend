// Página de un curso en vivo: menú del curso a la izquierda y, según la pestaña,
// la página de inicio, los módulos por semana o la videoconferencia.
import { useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import { CalendarDays, ChevronDown, ClipboardCheck, ClipboardList, FileText, Link2, ListChecks, Menu, MessagesSquare, MonitorUp, PenLine, Radio, Target, UserSquare2, Users, Video } from 'lucide-react';
import { money } from '../api.js';
import { Modal } from '../ui.jsx';
import { NotFound } from '../pages/Static.jsx';
import { CLASES, DESCUENTO_ESTUDIANTES, cupos, fechaCorta } from './datos-prueba.js';

const ICONO = { enlace: Link2, foro: MessagesSquare, pagina: FileText, tarea: ClipboardList };
const caja = 'rounded-xl border-2 border-sky-500 bg-white';
const boton = 'flex items-center justify-between gap-3 rounded-lg border-[3px] border-emerald-500 bg-white px-4 py-4 text-left font-display text-sm font-extrabold uppercase tracking-wide text-ink shadow-sm hover:bg-emerald-50';

function Inicio({ c, base }) {
  const [ver, setVer] = useState(null);
  return (<>
    <h1 className="text-3xl font-semibold text-slate-700 sm:text-4xl">{c.title}</h1>
    <div className={`relative mt-7 flex h-56 items-end overflow-hidden bg-gradient-to-br sm:h-80 ${c.tone}`}>
      <Radio className="absolute right-8 top-8 h-40 w-40 text-white/15" aria-hidden="true" />
      <p className="absolute left-5 top-5 font-display text-2xl font-extrabold text-white">Aula <span className="text-amber-300">Pro</span> Online</p>
      <p className="mb-6 ml-6 border-l-[10px] border-sky-400 bg-slate-900/90 px-4 py-2 font-display text-lg font-bold uppercase tracking-[0.2em] text-white">Clases en vivo</p>
    </div>
    <div className={`${caja} mt-5 px-5 py-6 text-center`}>
      <h2 className="text-2xl text-ink sm:text-3xl">¡Bienvenido al curso {c.title}!</h2>
      <p className="mt-3 text-[17px] text-ink">{c.welcome}</p>
    </div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <button className={boton} onClick={() => setVer('docente')}>Docente<UserSquare2 className="h-7 w-7 shrink-0" aria-hidden="true" /></button>
      <button className={boton} onClick={() => setVer('silabo')}>Sílabo<ClipboardCheck className="h-7 w-7 shrink-0" aria-hidden="true" /></button>
      <Link className={boton} to={`${base}/modulos`}>Módulos<Menu className="h-7 w-7 shrink-0" aria-hidden="true" /></Link>
      <button className={boton} onClick={() => setVer('evaluacion')}>Sistema de evaluación<Target className="h-7 w-7 shrink-0" aria-hidden="true" /></button>
    </div>
    <p className="mt-5 rounded-xl bg-sky-500 py-5 text-center font-display text-3xl font-semibold uppercase text-white">Capacidades</p>
    <ul className={`${caja} mt-5 list-disc space-y-3 py-5 pl-12 pr-5 text-[17px] text-ink`}>{c.capacidades.map((x) => <li key={x}>{x}</li>)}</ul>
    <div className="mt-5 flex justify-center"><Link className={`${boton} min-w-[290px]`} to={`${base}/videoconferencia`}>Videoconferencias<Video className="h-7 w-7 shrink-0" aria-hidden="true" /></Link></div>

    {ver === 'docente' && <Modal title="Docente" onClose={() => setVer(null)}><p className="text-lg font-bold text-ink">{c.instructor}</p><p className="mt-1 text-slate-800">Dicta las clases en vivo y responde tus consultas en el foro del curso.</p></Modal>}
    {ver === 'silabo' && <Modal title="Sílabo" onClose={() => setVer(null)}><ol className="list-decimal space-y-2 pl-5 text-ink">{c.silabo.map((x) => <li key={x}>{x}</li>)}</ol></Modal>}
    {ver === 'evaluacion' && <Modal title="Sistema de evaluación" onClose={() => setVer(null)}><table className="w-full text-ink"><tbody>{c.evaluacion.map(([n, p]) => <tr key={n} className="border-b border-slate-200"><td className="py-2.5">{n}</td><td className="py-2.5 text-right font-bold">{p}</td></tr>)}</tbody></table></Modal>}
  </>);
}

function Modulos({ c }) {
  const Grupo = ({ t, items }) => (<>
    <p className="border-b border-slate-300 bg-white px-4 py-4 text-lg font-bold text-slate-700">{t}</p>
    {items.map(([tipo, texto, pts]) => { const Icon = ICONO[tipo]; return (
      <div key={texto} className="flex items-center gap-4 border-b border-slate-300 bg-white px-4 py-4"><Icon className="h-5 w-5 shrink-0 text-slate-700" aria-hidden="true" />
        <div><p className={tipo === 'enlace' ? 'text-[17px] text-sky-600' : 'text-[17px] font-bold text-ink'}>{texto}</p>{pts && <p className="text-sm text-slate-700">{pts}</p>}</div></div>); })}
  </>);
  return (
    <div className="space-y-6">
      <h1 className="sr-only">Módulos</h1>
      {c.weeks.map((w, i) => (
        <details key={w.title} open={i === 0} className="group border border-slate-300">
          <summary className="flex cursor-pointer list-none items-center gap-2 bg-slate-100 px-4 py-5 text-lg font-semibold text-ink"><ChevronDown className="h-4 w-4 -rotate-90 transition group-open:rotate-0" aria-hidden="true" />{w.title}</summary>
          <div className="border-t border-slate-300"><Grupo t="Antes de la clase" items={w.antes} /><Grupo t="Durante la clase" items={w.durante} /><Grupo t="Después de la clase" items={w.despues} /></div>
        </details>))}
    </div>);
}

function Videoconferencia({ c }) {
  const [aviso, setAviso] = useState(false);
  return (<>
    <h1 className="text-3xl font-semibold text-slate-700">Videoconferencia</h1>
    <div className="mt-6 grid aspect-video max-h-[520px] w-full place-items-center rounded-xl bg-slate-900 p-6 text-center text-white">
      <div><Video className="mx-auto h-16 w-16 text-white/40" aria-hidden="true" />
        <p className="mt-4 text-xl font-bold">Próxima clase: {c.days}, {c.hours}</p>
        <p className="mt-1 text-white/80">Aquí se abrirá la sala con cámara, pizarra y pantalla compartida.</p>
        <button className="btn-primary mt-5" onClick={() => setAviso(true)}><Radio className="h-5 w-5" />Entrar a la clase</button>
        {aviso && <p className="mt-3 rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold">Pantalla de prueba: la sala se conectará en el siguiente paso.</p>}</div>
    </div>
    <ul className="mt-5 grid gap-3 sm:grid-cols-3">{[[Video, 'Videollamada'], [PenLine, 'Pizarra'], [MonitorUp, 'Pantalla compartida']].map(([Icon, t]) =>
      <li key={t} className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 font-bold text-ink"><Icon className="h-6 w-6 text-sky-600" aria-hidden="true" />{t}</li>)}</ul>
  </>);
}

export default function CursoEnVivo() {
  const { slug, seccion } = useParams();
  const c = CLASES.find((x) => x.slug === slug);
  const [aviso, setAviso] = useState(false);
  if (!c) return <NotFound />;
  const base = `/clases-en-vivo/${c.slug}`, libres = cupos(c), conDescuento = Math.round(c.price * (100 - DESCUENTO_ESTUDIANTES)) / 100;
  const MENU = [[base, 'Página de Inicio'], [`${base}/videoconferencia`, 'Videoconferencia'], [`${base}/modulos`, 'Módulos']];
  return (
    <div className="mx-auto max-w-[1700px] px-5 py-5 sm:px-8">
      <p className="flex items-center gap-4 border-b border-slate-300 pb-4 text-xl text-ink"><Menu className="h-7 w-7 text-sky-600" aria-hidden="true" /><Link to="/clases-en-vivo" className="text-sky-700 hover:underline">Tablero</Link><span className="text-slate-500">›</span>{c.code}</p>
      <div className="mt-5 flex flex-col gap-8 lg:flex-row">
        <nav className="shrink-0 lg:w-56" aria-label="Menú del curso">
          <p className="mb-2 px-2 text-sm italic text-slate-700">{c.period}</p>
          <div className="flex flex-wrap gap-x-2 lg:block">{MENU.map(([to, l]) => <NavLink key={to} to={to} end className={({ isActive }) => `block border-l-2 px-2 py-2.5 text-lg ${isActive ? 'border-ink font-semibold text-ink' : 'border-transparent text-sky-600 hover:underline'}`}>{l}</NavLink>)}</div>
        </nav>
        <main className="min-w-0 flex-1">{seccion === 'modulos' ? <Modulos c={c} /> : seccion === 'videoconferencia' ? <Videoconferencia c={c} /> : <Inicio c={c} base={base} />}</main>
        <aside className="shrink-0 xl:w-[300px] lg:w-64">
          <div className="rounded border border-slate-300 bg-slate-50 p-4">
            <p className="text-lg font-bold text-ink">Matrícula</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-brand-500">{money(c.price)}</p>
            <p className="mt-1 text-sm font-semibold text-amber-900">Con curso grabado: {money(conDescuento)} ({DESCUENTO_ESTUDIANTES}% menos)</p>
            <button className="btn-primary mt-3 w-full" disabled={!libres} onClick={() => setAviso(true)}>{libres ? 'Matricularme' : 'Sin cupos'}</button>
            {aviso && <p className="mt-2 rounded bg-emerald-50 px-2 py-2 text-sm font-semibold text-emerald-900">Pantalla de prueba: el pago se activará al conectar el backend.</p>}
          </div>
          <ul className="mt-3 space-y-2">{[[CalendarDays, `Del ${fechaCorta(c.start)} al ${fechaCorta(c.end)}`], [ListChecks, `${c.days}, ${c.hours}`], [Users, libres ? `Quedan ${libres} de ${c.seats} cupos` : 'Cupos agotados']].map(([Icon, t]) =>
            <li key={t} className="flex items-start gap-2.5 rounded border border-slate-300 bg-slate-50 px-4 py-3 text-[15px] font-medium text-ink"><Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />{t}</li>)}</ul>
        </aside>
      </div>
    </div>
  );
}
