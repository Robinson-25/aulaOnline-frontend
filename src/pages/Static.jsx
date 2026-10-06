import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Lock, Mail } from 'lucide-react';
import { api, SITE } from '../api.js';
import { Alert, Button } from '../ui.jsx';
import { SOCIAL } from '../contacto.jsx';

const Msg = ({ icon: Icon, code, title, text }) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
    <Icon className="h-12 w-12 text-navy-700" aria-hidden="true" />
    <p className="mt-4 font-display text-5xl font-extrabold text-brand-500">{code}</p>
    <h1 className="mt-2 text-2xl font-extrabold">{title}</h1>
    <p className="mt-2 max-w-md text-slate-600">{text}</p>
    <div className="mt-6 flex flex-wrap justify-center gap-3"><Link to="/" className="btn-primary">Ir al inicio</Link><Link to="/cursos" className="btn-outline">Ver cursos</Link></div>
  </div>
);
export const NotFound = () => <Msg icon={Compass} code="404" title="No encontramos esta página" text="El enlace puede estar mal escrito o la página ya no existe." />;
export const Forbidden = () => <Msg icon={Lock} code="403" title="No tienes acceso a esta sección" text="Esta página es solo para cuentas autorizadas." />;

export function Contact() {
  const [v, setV] = useState({ name: '', email: '', message: '' }), [state, setState] = useState({});
  const send = async (e) => { e.preventDefault(); setState({ loading: true }); try { await api('/contact', { method: 'POST', body: v }); setState({ ok: true }); } catch (er) { setState({ error: er.message }); } };
  const bind = (k) => ({ value: v[k], onChange: (e) => setV({ ...v, [k]: e.target.value }) });
  // Etiquetas en negrita y cuadros con borde más marcado
  const lbl = 'mb-1.5 block text-[15px] font-bold text-ink';
  const field = 'input border-slate-400 font-medium text-ink placeholder:text-slate-500';
  const req = <span className="text-brand-500" aria-hidden="true"> *</span>;
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-navy-50 via-white to-white">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-navy-100/70 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-24 top-40 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl" aria-hidden="true" />
      <div className="container-x relative py-14">
        {/* Título centrado */}
        <div className="text-center">
          <p className="eyebrow">Contacto</p>
          <h1 className="h-section mt-1">¿En qué podemos ayudarte?</h1>
          <p className="mt-2 text-[17px] font-medium text-slate-700">Escríbenos y te responderemos al correo que indiques.</p>
        </div>

        {/* Redes a la izquierda + formulario, todo centrado */}
        <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
          <ul className="flex shrink-0 gap-2.5 rounded-2xl border border-slate-300 bg-white p-2.5 shadow-card sm:flex-col" aria-label="Redes sociales">
            {SOCIAL.map(([name, href, Icon, hover]) => (
              <li key={name}>
                <a href={href} target="_blank" rel="noreferrer" aria-label={name} title={name} className={`flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-navy-900 ring-1 ring-slate-300 transition duration-200 hover:-translate-y-0.5 hover:text-white hover:shadow-md hover:ring-0 ${hover}`}>
                  <Icon className="h-5 w-5" />
                </a>
              </li>))}
          </ul>

          <div className="w-full min-w-0 flex-1">
            {state.ok ? <Alert type="ok">Recibimos tu mensaje. Te responderemos pronto.</Alert> : (
              <form onSubmit={send} className="space-y-4 rounded-2xl border border-slate-300 bg-white p-6 shadow-card sm:p-7" noValidate>
                <Alert>{state.error}</Alert>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block"><span className={lbl}>Nombre{req}</span><input className={field} autoComplete="name" required {...bind('name')} /></label>
                  <label className="block"><span className={lbl}>Correo electrónico{req}</span><input className={field} type="email" autoComplete="email" required {...bind('email')} /></label>
                </div>
                <label className="block"><span className={lbl}>Mensaje{req}</span><textarea className={`${field} min-h-[160px]`} required {...bind('message')} /></label>
                <Button loading={state.loading} className="btn-primary w-full sm:w-auto"><Mail className="h-4 w-4" />Enviar mensaje</Button>
              </form>)}
          </div>
        </div>
      </div>
    </div>
  );
}
const Legal = ({ title, items }) => (
  <div className="container-x max-w-3xl py-12">
    <h1 className="h-section">{title}</h1>
    <div className="mt-4"><Alert type="info">Texto de ejemplo. Reemplázalo por el documento legal definitivo de tu empresa antes de publicar el sitio.</Alert></div>
    <div className="mt-6 space-y-5">{items.map(([h, p]) => <section key={h}><h2 className="text-lg font-bold">{h}</h2><p className="mt-1 text-[15px] leading-relaxed text-slate-700">{p}</p></section>)}</div>
  </div>
);
export const Terms = () => <Legal title="Términos y condiciones" items={[
  ['Uso de la plataforma', `Al crear una cuenta en ${SITE.full} aceptas usar los cursos de forma personal y no compartir tu acceso.`],
  ['Compras y acceso', 'El acceso a un curso se activa cuando el pago es confirmado. Los precios se muestran en soles (S/).'],
  ['Certificados', 'El certificado se emite al completar todas las lecciones y aprobar la evaluación del curso. Puede anularse si se detecta un uso indebido.'],
  ['Contenido', 'Los videos, textos y materiales pertenecen a sus autores y no pueden redistribuirse sin autorización.']]} />;
export const Privacy = () => <Legal title="Política de privacidad" items={[
  ['Datos que guardamos', 'Nombre, correo, celular (opcional), tus compras y tu avance en los cursos.'],
  ['Pagos', 'No almacenamos números de tarjeta, claves ni códigos de seguridad. Solo guardamos el número de operación y el comprobante que nos envías.'],
  ['Certificados públicos', 'La página de verificación muestra únicamente tu nombre, el curso, la fecha y el estado del certificado.'],
  ['Tus derechos', 'Puedes solicitar la actualización o eliminación de tus datos desde la página de contacto.']]} />;
