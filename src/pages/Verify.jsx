import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BadgeCheck, ShieldX } from 'lucide-react';
import { fecha } from '../api.js';
import { useLoad, PageLoader } from '../ui.jsx';

export default function Verify() {
  const { code } = useParams(), nav = useNavigate();
  const [text, setText] = useState(code || '');
  const s = useLoad(code ? `/verify/${encodeURIComponent(code)}` : null);
  return (
    <div className="bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="text-center text-3xl font-extrabold">Verificar certificado</h1>
        <p className="mt-2 text-center text-slate-600">Ingresa el código que aparece en el certificado o escanea su código QR.</p>
        <form className="mt-6 flex gap-2" onSubmit={(e) => { e.preventDefault(); text.trim() && nav(`/verificar/${text.trim().toUpperCase()}`); }}>
          <input className="input uppercase" value={text} onChange={(e) => setText(e.target.value)} placeholder="APO-XXXXXXXXXX" aria-label="Código del certificado" />
          <button className="btn-navy">Verificar</button>
        </form>
        {code && (s.loading ? <PageLoader text="Verificando…" /> : (
          <div className="card mt-6 p-6 text-center" role="status">
            {s.data?.valid ? (
              <><BadgeCheck className="mx-auto h-14 w-14 text-emerald-600" /><h2 className="mt-3 text-xl font-bold text-emerald-700">Certificado válido</h2></>
            ) : (
              <><ShieldX className="mx-auto h-14 w-14 text-red-600" /><h2 className="mt-3 text-xl font-bold text-red-700">{s.data ? 'Certificado anulado: ya no está vigente' : 'Certificado no encontrado'}</h2>
                {!s.data && <p className="mt-2 text-slate-600">Revisa que el código esté bien escrito.</p>}</>
            )}
            {s.data && (
              <dl className="mt-5 grid gap-3 border-t border-slate-200 pt-5 text-left sm:grid-cols-2">
                {[['Estudiante', s.data.student_name], ['Curso', s.data.course], ['Fecha de emisión', fecha(s.data.issued_at)], ['Código', s.data.code]].map(([k, v]) => (
                  <div key={k}><dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{k}</dt><dd className="font-semibold">{v}</dd></div>))}
              </dl>)}
          </div>))}
      </div>
    </div>
  );
}
