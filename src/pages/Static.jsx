import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Lock, Mail } from 'lucide-react';
import { api, SITE } from '../api.js';
import { Alert, Button, Field } from '../ui.jsx';

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
  return (
    <div className="container-x max-w-2xl py-12">
      <p className="eyebrow">Contacto</p><h1 className="h-section mt-1">¿En qué podemos ayudarte?</h1>
      <p className="mt-2 text-slate-600">Escríbenos y te responderemos al correo que indiques.</p>
      {state.ok ? <div className="mt-6"><Alert type="ok">Recibimos tu mensaje. Te responderemos pronto.</Alert></div> : (
        <form onSubmit={send} className="card mt-6 space-y-4 p-6" noValidate>
          <Alert>{state.error}</Alert>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre" required><input className="input" autoComplete="name" required {...bind('name')} /></Field>
            <Field label="Correo electrónico" required><input className="input" type="email" autoComplete="email" required {...bind('email')} /></Field>
          </div>
          <Field label="Mensaje" required><textarea className="input min-h-[140px]" required {...bind('message')} /></Field>
          <Button loading={state.loading} className="btn-primary"><Mail className="h-4 w-4" />Enviar mensaje</Button>
        </form>)}
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
