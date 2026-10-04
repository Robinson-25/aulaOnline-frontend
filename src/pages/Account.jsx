import { useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import { Award, Download, GraduationCap, Settings, ShoppingCart } from 'lucide-react';
import { api, asset, fecha, money } from '../api.js';
import { useAuth } from '../auth.jsx';
import { useLoad, LoadState, Empty, Badge, ProgressBar, Alert, Button, Field, useToast } from '../ui.jsx';
import { Cover } from '../CourseCard.jsx';

const TABS = [['cursos', 'Mis cursos', GraduationCap], ['certificados', 'Mis certificados', Award], ['compras', 'Mis compras', ShoppingCart], ['configuracion', 'Configuración', Settings]];
export default function Account() {
  const { tab = 'cursos' } = useParams();
  const { user } = useAuth();
  const View = { cursos: Courses, certificados: Certs, compras: Orders, configuracion: Config }[tab] || Courses;
  return (
    <div className="bg-slate-100 py-8">
      <div className="container-x">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-xl font-bold text-white">{user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}</span>
          <div className="min-w-0"><p className="text-slate-600">Hola,</p><h1 className="truncate text-2xl font-extrabold">{user.name}</h1></div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[230px_1fr]">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Mi cuenta">
            {TABS.map(([id, label, Icon]) => (
              <NavLink key={id} to={`/mi-cuenta/${id}`} className={() => `flex shrink-0 items-center gap-2.5 rounded-lg px-4 py-3 text-[15px] font-semibold ${tab === id ? 'bg-navy-900 text-white' : 'bg-white text-ink hover:bg-navy-50'}`}><Icon className="h-4 w-4" />{label}</NavLink>))}
          </nav>
          <div className="min-w-0"><View /></div>
        </div>
      </div>
    </div>
  );
}

function Courses() {
  const s = useLoad('/my/courses');
  return <LoadState s={s}>{(list) => list.length ? (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{list.map((c) => (
      <article key={c.id} className="card flex flex-col overflow-hidden">
        <Cover src={c.image} className="aspect-[16/9] w-full" />
        <div className="flex flex-1 flex-col p-4">
          <h2 className="font-display text-lg font-bold leading-snug">{c.title}</h2>
          <div className="mt-3 flex items-center justify-between text-sm text-slate-600"><span>{c.done}/{c.total} lecciones</span><b className="text-ink">{c.percent}%</b></div>
          <div className="mt-1.5"><ProgressBar value={c.percent} /></div>
          <p className="mt-2 text-sm text-slate-600">{c.last_lesson ? <>Última lección: <span className="text-ink">{c.last_lesson}</span></> : 'Aún no has empezado.'}</p>
          <Link to={`/aula/${c.slug}`} className="btn-primary mt-4">{c.percent === 100 ? 'Repasar curso' : c.last_lesson ? 'Continuar aprendiendo' : 'Empezar el aprendizaje'}</Link>
        </div>
      </article>))}</div>
  ) : <Empty icon={GraduationCap} title="Aún no tienes cursos">Cuando compres un curso y tu pago sea aprobado, aparecerá aquí.<Link to="/cursos" className="btn-primary btn-sm mx-auto mt-4 flex w-fit">Explorar cursos</Link></Empty>}</LoadState>;
}
function Certs() {
  const s = useLoad('/my/certificates');
  return <LoadState s={s}>{(list) => list.length ? (
    <ul className="space-y-3">{list.map((c) => (
      <li key={c.code} className="card flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex min-w-0 items-center gap-3"><Award className="h-9 w-9 shrink-0 text-brand-500" /><div className="min-w-0"><b className="block">{c.title}</b><span className="text-sm text-slate-600">Emitido el {fecha(c.issued_at)} · {c.code}</span>{!!c.revoked && <div><Badge tone="rechazada">Anulado</Badge></div>}</div></div>
        <div className="flex gap-2"><Link to={`/verificar/${c.code}`} className="btn-outline btn-sm">Verificar</Link><a href={asset(`/api/certificates/${c.code}/pdf`)} target="_blank" rel="noreferrer" className="btn-navy btn-sm"><Download className="h-4 w-4" />PDF</a></div>
      </li>))}</ul>
  ) : <Empty icon={Award} title="Todavía no tienes certificados">Completa todas las lecciones y aprueba el examen de un curso para obtener el tuyo.</Empty>}</LoadState>;
}
const METHOD = { yape: 'Yape', plin: 'Plin', transferencia: 'Transferencia', gratis: 'Sin costo' };
const STATUS_TEXT = { pendiente: 'Estamos verificando tu pago.', aprobada: 'Pago confirmado. El curso está en tu cuenta.', cancelada: 'Cancelaste este pedido.' };
function Orders() {
  const s = useLoad('/orders/mine'), toast = useToast();
  const cancel = async (o) => {
    if (!(await toast.confirm('Cancelar pedido', `¿Deseas cancelar el pedido ${o.code}? Si ya pagaste, no lo canceles y espera la verificación.`, 'Sí, cancelar'))) return;
    try { await api(`/orders/${o.id}/cancel`, { method: 'POST' }); toast.ok('Pedido cancelado.'); s.reload(); } catch (e) { toast.error(e.message); }
  };
  return <LoadState s={s}>{(list) => list.length ? (
    <ul className="space-y-3">{list.map((o) => (
      <li key={o.id} className="card p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0"><b className="block">{o.title}</b><span className="text-sm text-slate-600">{o.code} · {fecha(o.created_at)} · {METHOD[o.method] || o.method}{o.coupon_code && ` · Cupón ${o.coupon_code}`}</span></div>
          <div className="text-right"><b className="block font-display text-lg">{money(o.total)}</b><Badge tone={o.status}>{o.status[0].toUpperCase() + o.status.slice(1)}</Badge></div>
        </div>
        <p className="mt-2 text-sm text-slate-600">{o.status === 'rechazada' ? `No se aprobó: ${o.note || 'no pudimos verificar el pago.'}` : STATUS_TEXT[o.status]}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {o.status === 'aprobada' && <Link to={`/aula/${o.slug}`} className="btn-primary btn-sm">Ir a mi curso</Link>}
          {(o.status === 'rechazada' || o.status === 'cancelada') && <Link to={`/comprar/${o.slug}`} className="btn-primary btn-sm">Volver a intentar</Link>}
          {o.status === 'pendiente' && <button className="btn-outline btn-sm" onClick={() => cancel(o)}>Cancelar pedido</button>}
        </div>
      </li>))}</ul>
  ) : <Empty icon={ShoppingCart} title="No tienes compras registradas"><Link to="/cursos" className="btn-primary btn-sm mx-auto mt-3 flex w-fit">Explorar cursos</Link></Empty>}</LoadState>;
}
function Config() {
  const { user, setUser } = useAuth(), toast = useToast();
  const [p, setP] = useState({ name: user.name, phone: user.phone }), [pw, setPw] = useState({ current: '', password: '' });
  const [err, setErr] = useState({}), [busy, setBusy] = useState('');
  const run = (key, fn) => async (e) => { e.preventDefault(); setErr({}); setBusy(key); try { await fn(); } catch (er) { setErr({ [key]: er.message }); } finally { setBusy(''); } };
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <form className="card space-y-4 p-5" onSubmit={run('p', async () => { setUser(await api('/me', { method: 'PUT', body: p })); toast.ok('Datos actualizados.'); })}>
        <h2 className="text-lg font-bold">Datos personales</h2><Alert>{err.p}</Alert>
        <Field label="Nombre completo" required hint="Se usa en tus próximos certificados."><input className="input" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} required /></Field>
        <Field label="Correo electrónico"><input className="input bg-slate-100" value={user.email} disabled /></Field>
        <Field label="Celular"><input className="input" type="tel" value={p.phone} onChange={(e) => setP({ ...p, phone: e.target.value })} /></Field>
        <Button loading={busy === 'p'} className="btn-primary">Guardar cambios</Button>
      </form>
      <form className="card space-y-4 p-5" onSubmit={run('w', async () => { await api('/me/password', { method: 'PUT', body: pw }); setPw({ current: '', password: '' }); toast.ok('Contraseña actualizada.'); })}>
        <h2 className="text-lg font-bold">Cambiar contraseña</h2><Alert>{err.w}</Alert>
        <Field label="Contraseña actual" required><input className="input" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} required /></Field>
        <Field label="Nueva contraseña" required hint="Mínimo 8 caracteres."><input className="input" type="password" autoComplete="new-password" value={pw.password} onChange={(e) => setPw({ ...pw, password: e.target.value })} required /></Field>
        <Button loading={busy === 'w'} className="btn-primary">Actualizar contraseña</Button>
      </form>
    </div>
  );
}
