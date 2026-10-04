import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { Alert, Button, Field } from '../ui.jsx';

const Shell = ({ title, text, children, footer }) => (
  <div className="bg-slate-100 px-4 py-12">
    <div className="card mx-auto max-w-md p-6 sm:p-8">
      <h1 className="text-2xl font-extrabold">{title}</h1>
      {text && <p className="mt-1.5 text-[15px] text-slate-600">{text}</p>}
      <div className="mt-6">{children}</div>
      {footer && <p className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-600">{footer}</p>}
    </div>
  </div>
);
// Formulario con estados de envío y error; conserva lo que la persona escribió si algo falla.
function useForm(initial, action) {
  const [v, setV] = useState(initial), [error, setError] = useState(''), [loading, setLoading] = useState(false);
  const bind = (k) => ({ value: v[k], onChange: (e) => setV({ ...v, [k]: e.target.value }) });
  const submit = async (e) => { e.preventDefault(); setError(''); setLoading(true); try { await action(v); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  return { v, bind, submit, error, loading };
}
const lnk = 'font-semibold text-brand-500 hover:underline';

export function Login() {
  const { user, login } = useAuth(), nav = useNavigate(), from = useLocation().state?.from;
  const f = useForm({ email: '', password: '' }, async (v) => { const u = await login(v.email, v.password); nav(from || '/mi-cuenta', { replace: true }); void u; });
  if (user && !f.loading) return <Navigate to={from || '/mi-cuenta'} replace />;
  return (
    <Shell title="Iniciar sesión" text={from?.startsWith('/comprar') ? 'Ingresa para asociar la compra a tu cuenta.' : 'Continúa aprendiendo donde lo dejaste.'}
      footer={<>¿Aún no tienes cuenta? <Link to="/registro" state={{ from }} className={lnk}>Regístrate</Link></>}>
      <form onSubmit={f.submit} className="space-y-4" noValidate>
        <Alert>{f.error}</Alert>
        <Field label="Correo electrónico" required><input className="input" type="email" autoComplete="email" required {...f.bind('email')} /></Field>
        <Field label="Contraseña" required><input className="input" type="password" autoComplete="current-password" required {...f.bind('password')} /></Field>
        <div className="text-right"><Link to="/recuperar" className={`text-sm ${lnk}`}>¿Olvidaste tu contraseña?</Link></div>
        <Button loading={f.loading} className="btn-primary w-full">Ingresar</Button>
      </form>
    </Shell>
  );
}
export function Register() {
  const { user, register } = useAuth(), nav = useNavigate(), from = useLocation().state?.from;
  const f = useForm({ name: '', email: '', password: '' }, async (v) => { await register(v); nav(from || '/mi-cuenta', { replace: true }); });
  if (user && !f.loading) return <Navigate to={from || '/mi-cuenta'} replace />;
  return (
    <Shell title="Crear mi cuenta" text="Regístrate para comprar cursos y guardar tu avance." footer={<>¿Ya tienes cuenta? <Link to="/ingresar" state={{ from }} className={lnk}>Inicia sesión</Link></>}>
      <form onSubmit={f.submit} className="space-y-4" noValidate>
        <Alert>{f.error}</Alert>
        <Field label="Nombre completo" required hint="Así aparecerá en tu certificado."><input className="input" autoComplete="name" required {...f.bind('name')} /></Field>
        <Field label="Correo electrónico" required><input className="input" type="email" autoComplete="email" required {...f.bind('email')} /></Field>
        <Field label="Contraseña" required hint="Mínimo 8 caracteres."><input className="input" type="password" autoComplete="new-password" minLength={8} required {...f.bind('password')} /></Field>
        <Button loading={f.loading} className="btn-primary w-full">Registrarme</Button>
        <p className="text-center text-xs text-slate-500">Al registrarte aceptas los <Link to="/terminos" className="underline">Términos</Link> y la <Link to="/privacidad" className="underline">Política de privacidad</Link>.</p>
      </form>
    </Shell>
  );
}
export function Forgot() {
  const [sent, setSent] = useState(false);
  const f = useForm({ email: '' }, async (v) => { await api('/auth/forgot', { method: 'POST', body: v }); setSent(true); });
  return (
    <Shell title="Recuperar contraseña" text="Te enviaremos un enlace para crear una nueva contraseña." footer={<Link to="/ingresar" className={lnk}>Volver a iniciar sesión</Link>}>
      {sent ? <Alert type="ok">Si el correo está registrado, recibirás un enlace en unos minutos. Revisa también tu carpeta de spam.</Alert> : (
        <form onSubmit={f.submit} className="space-y-4" noValidate>
          <Alert>{f.error}</Alert>
          <Field label="Correo electrónico" required><input className="input" type="email" autoComplete="email" required {...f.bind('email')} /></Field>
          <Button loading={f.loading} className="btn-primary w-full">Enviar enlace</Button>
        </form>)}
    </Shell>
  );
}
export function Reset() {
  const { token } = useParams();
  const [done, setDone] = useState(false);
  const f = useForm({ password: '' }, async (v) => { await api('/auth/reset', { method: 'POST', body: { token, password: v.password } }); setDone(true); });
  return (
    <Shell title="Nueva contraseña">
      {done ? <><Alert type="ok">Tu contraseña fue actualizada.</Alert><Link to="/ingresar" className="btn-primary mt-4 w-full">Iniciar sesión</Link></> : (
        <form onSubmit={f.submit} className="space-y-4" noValidate>
          <Alert>{f.error}</Alert>
          <Field label="Nueva contraseña" required hint="Mínimo 8 caracteres."><input className="input" type="password" autoComplete="new-password" required {...f.bind('password')} /></Field>
          <Button loading={f.loading} className="btn-primary w-full">Guardar contraseña</Button>
        </form>)}
    </Shell>
  );
}
