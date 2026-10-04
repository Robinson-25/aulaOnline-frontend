import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import { api, money } from '../api.js';
import { useLoad, LoadState, Alert, Button, Field } from '../ui.jsx';
import { Cover } from '../CourseCard.jsx';

export default function Checkout() {
  const { slug } = useParams();
  const course = useLoad(`/courses/${slug}`), config = useLoad('/config');
  const [coupon, setCoupon] = useState(null), [code, setCode] = useState(''), [couponMsg, setCouponMsg] = useState('');
  const [method, setMethod] = useState(''), [ref, setRef] = useState(''), [file, setFile] = useState(null);
  const [error, setError] = useState(''), [loading, setLoading] = useState(false), [done, setDone] = useState(null);

  const applyCoupon = async () => {
    setCouponMsg('');
    try { setCoupon(await api('/coupons/check', { method: 'POST', body: { code } })); } catch (e) { setCoupon(null); setCouponMsg(e.message); }
  };
  return (
    <LoadState s={{ ...course, loading: course.loading || config.loading }}>{(c) => {
      if (done) return <Done done={done} course={c} />;
      if (c.enrolled) return <Navigate to={`/aula/${c.slug}`} replace />;
      const discount = coupon ? Math.round(c.price * coupon.percent) / 100 : 0, total = Math.max(0, c.price - discount), free = total === 0;
      const methods = config.data?.methods || [], sel = methods.find((m) => m.id === method);
      const pay = async (e) => {
        e.preventDefault(); setError('');
        if (!free && !sel) return setError('Selecciona un método de pago.');
        if (!free && ref.trim().length < 4 && !file) return setError('Ingresa el número de operación o adjunta tu comprobante.');
        const fd = new FormData(); fd.append('courseId', c.id);
        if (coupon) fd.append('coupon', coupon.code);
        if (!free) { fd.append('method', method); fd.append('operationRef', ref); if (file) fd.append('voucher', file); }
        setLoading(true);
        try { setDone(await api('/orders', { method: 'POST', form: fd })); window.scrollTo(0, 0); } catch (err) { setError(err.message); } finally { setLoading(false); }
      };
      return (
        <div className="bg-slate-100 py-10">
          <form onSubmit={pay} className="container-x grid gap-6 lg:grid-cols-[1fr_380px]" noValidate>
            <div className="space-y-6">
              <h1 className="text-2xl font-extrabold sm:text-3xl">Finalizar compra</h1>
              {c.pendingOrder && <Alert type="info">Ya tienes el pedido <b>{c.pendingOrder.code}</b> pendiente para este curso. <Link className="font-semibold underline" to="/mi-cuenta/compras">Ver mis compras</Link></Alert>}
              <section className="card p-5 sm:p-6">
                <h2 className="text-lg font-bold">Método de pago</h2>
                {free ? <p className="mt-3 text-[15px] text-slate-600">Este pedido no tiene costo. Confirma para inscribirte.</p> : (
                  <>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Método de pago">
                      {methods.map((m) => (
                        <label key={m.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 font-semibold ${method === m.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                          <input type="radio" name="method" className="h-4 w-4 accent-[#E0212F]" checked={method === m.id} onChange={() => setMethod(m.id)} />{m.name}
                        </label>))}
                      <div className="flex items-center gap-3 rounded-lg border-2 border-dashed border-slate-200 p-4 text-slate-500"><CreditCard className="h-5 w-5 shrink-0" /><span><b className="block text-sm">Tarjeta de crédito o débito</b><span className="text-xs">Aún no disponible en este sitio.</span></span></div>
                    </div>
                    {!methods.length && <div className="mt-4"><Alert>Todavía no hay métodos de pago configurados. Escríbenos desde la página de contacto.</Alert></div>}
                    {sel && (
                      <div className="mt-5 space-y-4 rounded-lg bg-navy-50 p-4">
                        <div className="text-[15px]">
                          <p className="font-bold text-navy-900">Paga {money(total)} con {sel.name}</p>
                          {sel.number && <p className="mt-1">Número: <b className="text-lg tabular-nums">{sel.number}</b></p>}
                          {sel.account && <><p className="mt-1">{sel.bank} · Cuenta: <b className="tabular-nums">{sel.account}</b></p>{sel.cci && <p>CCI: <b className="tabular-nums">{sel.cci}</b></p>}</>}
                          {sel.holder && <p>Titular: <b>{sel.holder}</b></p>}
                          <p className="mt-2 text-sm text-slate-600">Realiza el pago desde tu aplicación y luego registra aquí los datos para verificarlo.</p>
                        </div>
                        <Field label="Número de operación" hint="Lo encuentras en la constancia de tu pago."><input className="input" inputMode="numeric" value={ref} onChange={(e) => setRef(e.target.value)} maxLength={60} /></Field>
                        <Field label="Comprobante (opcional)" hint="Captura o PDF, máximo 6 MB."><input type="file" accept="image/*,.pdf" className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-navy-900 file:px-4 file:py-2.5 file:font-semibold file:text-white" onChange={(e) => setFile(e.target.files[0] || null)} /></Field>
                      </div>)}
                  </>)}
              </section>
              <p className="flex items-start gap-2 text-sm text-slate-600"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />Nunca te pediremos claves, números completos de tarjeta ni códigos de seguridad.</p>
            </div>
            <aside className="card h-fit p-5 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold">Tu pedido</h2>
              <div className="mt-4 flex gap-3"><Cover src={c.image} className="h-16 w-24 shrink-0 rounded-lg" /><div className="min-w-0"><b className="block leading-snug">{c.title}</b><span className="text-sm text-slate-600">{c.instructor}</span></div></div>
              <div className="mt-5">
                <span className="label">Cupón de descuento</span>
                <div className="flex gap-2"><input className="input uppercase" value={code} onChange={(e) => setCode(e.target.value)} aria-label="Código de cupón" placeholder="Código" /><button type="button" className="btn-outline" onClick={applyCoupon} disabled={!code.trim()}>Aplicar</button></div>
                {couponMsg && <p className="mt-1.5 text-sm text-red-700" role="alert">{couponMsg}</p>}
                {coupon && <p className="mt-1.5 text-sm font-semibold text-emerald-700">Cupón {coupon.code}: {coupon.percent}% de descuento aplicado. <button type="button" className="underline" onClick={() => { setCoupon(null); setCode(''); }}>Quitar</button></p>}
              </div>
              <dl className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-[15px]">
                <div className="flex justify-between"><dt>Precio</dt><dd>{money(c.price)}</dd></div>
                {discount > 0 && <div className="flex justify-between text-emerald-700"><dt>Descuento</dt><dd>− S/ {discount.toFixed(2)}</dd></div>}
                <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-extrabold"><dt>Total</dt><dd>{money(total)}</dd></div>
              </dl>
              <div className="mt-4"><Alert>{error}</Alert></div>
              <Button loading={loading} disabled={!!c.pendingOrder} className="btn-primary mt-4 w-full">{free ? 'Confirmar inscripción' : 'Registrar mi pago'}</Button>
            </aside>
          </form>
        </div>
      );
    }}</LoadState>
  );
}

function Done({ done, course }) {
  const ok = done.status === 'aprobada';
  return (
    <div className="bg-slate-100 px-4 py-14">
      <div className="card mx-auto max-w-lg p-8 text-center">
        {ok ? <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" /> : <Clock className="mx-auto h-14 w-14 text-amber-500" />}
        <h1 className="mt-4 text-2xl font-extrabold">{ok ? '¡Inscripción confirmada!' : 'Recibimos tu pedido'}</h1>
        <p className="mt-2 text-slate-600">Pedido <b className="text-ink">{done.code}</b> · {course.title}</p>
        <p className="mt-3 text-[15px] text-slate-600">{ok ? 'El curso ya está en tu cuenta. Puedes empezar ahora.' : 'Tu pago está pendiente de verificación. Cuando lo confirmemos, el curso se activará en tu cuenta y te avisaremos por correo.'}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {ok ? <Link to={`/aula/${done.slug}`} className="btn-primary">Ir a mi curso</Link> : <Link to="/mi-cuenta/compras" className="btn-primary">Ver estado de mi compra</Link>}
          <Link to="/cursos" className="btn-outline">Seguir explorando</Link>
        </div>
      </div>
    </div>
  );
}
