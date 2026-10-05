import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Facebook, Instagram, LayoutDashboard, LogOut, Mail, Menu, Phone, User, X, Youtube } from 'lucide-react';
import { useAuth } from './auth.jsx';
import { ADMIN_URL, SITE } from './api.js';

export const Logo = ({ light }) => (
  <Link to="/" className="flex items-center gap-2.5" aria-label={`${SITE.full}, inicio`}>
    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-white"><BookOpen className="h-5 w-5" aria-hidden="true" /></span>
    <span className={`font-display text-xl font-extrabold ${light ? 'text-white' : 'text-navy-900'}`}>
      {SITE.first} <span className={light ? '' : 'text-brand-500'}>{SITE.accent}</span> {SITE.last}
    </span>
  </Link>
);
// ====== DATOS DE CONTACTO Y REDES: cámbialos por los tuyos ======
const CONTACT = {
  email: 'contacto@tudominio.com',
  phone: '+51 999 999 999',
  whatsapp: '51999999999', // solo números, con código de país
  facebook: 'https://facebook.com/',
  instagram: 'https://instagram.com/',
  tiktok: 'https://tiktok.com/',
  youtube: 'https://youtube.com/',
};

// Iconos de TikTok y WhatsApp (no vienen en la librería de iconos)
const TikTok = (p) => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>;
const WhatsApp = (p) => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>;
// Cada red: nombre, enlace, icono y color al pasar el mouse
const SOCIAL = [
  ['Facebook', CONTACT.facebook, Facebook, 'hover:bg-[#1877F2]'],
  ['Instagram', CONTACT.instagram, Instagram, 'hover:bg-[#E1306C]'],
  ['TikTok', CONTACT.tiktok, TikTok, 'hover:bg-black'],
  ['YouTube', CONTACT.youtube, Youtube, 'hover:bg-[#FF0000]'],
  ['WhatsApp', `https://wa.me/${CONTACT.whatsapp}`, WhatsApp, 'hover:bg-[#25D366]'],
];

const NAV = [['/', 'Inicio'], ['/cursos', 'Cursos'], ['/#como-funciona', 'Cómo funciona'], ['/contacto', 'Contacto']];

export default function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const loc = useLocation(), nav = useNavigate();
  useEffect(() => setOpen(false), [loc]);
  const out = () => { logout(); nav('/'); };
  const linkCls = ({ isActive }) => `rounded-md px-3 py-2 text-[15px] font-semibold ${isActive ? 'text-brand-500' : 'text-ink hover:text-brand-500'}`;
  const links = NAV.map(([to, label]) => to.includes('#')
    ? <Link key={to} to={to} className="rounded-md px-3 py-2 text-[15px] font-semibold text-ink hover:text-brand-500">{label}</Link>
    : <NavLink key={to} to={to} end={to === '/'} className={linkCls}>{label}</NavLink>);
  const userLinks = user ? (
    <>
      {user.role === 'admin' && <a href={ADMIN_URL} className="btn-soft btn-sm"><LayoutDashboard className="h-4 w-4" /> Panel</a>}
      <Link to="/mi-cuenta" className="btn-outline btn-sm"><User className="h-4 w-4" /> Mi cuenta</Link>
      <button onClick={out} className="btn btn-sm text-slate-600 hover:text-brand-500"><LogOut className="h-4 w-4" /> Salir</button>
    </>
  ) : (
    <>
      <Link to="/ingresar" className="btn btn-sm text-ink hover:text-brand-500">Iniciar sesión</Link>
      <Link to="/registro" className="btn-primary btn-sm">Registrarme</Link>
    </>
  );
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">Saltar al contenido</a>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="container-x flex h-[68px] items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">{links}</nav>
          <div className="hidden items-center gap-2 lg:flex">{userLinks}</div>
          <button className="rounded-lg p-2.5 text-navy-900 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menú">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-slate-200 bg-white lg:hidden">
            <nav className="container-x flex flex-col py-3" aria-label="Principal móvil">{links}<div className="mt-3 flex flex-wrap gap-2 border-t border-slate-200 pt-3">{userLinks}</div></nav>
          </div>
        )}
      </header>
      <main id="contenido" className="flex-1"><Outlet /></main>
      <footer className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-700 text-navy-100">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-brand-500/10 blur-2xl" aria-hidden="true" />
        <div className="container-x relative grid items-start gap-12 py-14 text-center md:grid-cols-3 md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Logo light />
            <p className="mt-4 max-w-xs text-[15px] text-navy-200">Aprende a tu ritmo, desde cualquier lugar del Perú.</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="font-display text-xl font-bold text-white">Síguenos</p>
            <ul className="mt-5 flex flex-wrap justify-center gap-3" aria-label="Redes sociales">
              {SOCIAL.map(([name, href, Icon, hover]) => (
                <li key={name}>
                  <a href={href} target="_blank" rel="noreferrer" aria-label={name} title={name} className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15 transition duration-200 hover:-translate-y-1 hover:shadow-lg ${hover}`}>
                    <Icon className="h-5 w-5" />
                  </a>
                </li>))}
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <p className="font-display text-xl font-bold text-white">Contáctanos</p>
            <a href={`mailto:${CONTACT.email}`} className="mt-4 inline-flex items-center gap-2.5 break-all text-[15px] text-sky-300 hover:text-white"><Mail className="h-4 w-4 shrink-0" aria-hidden="true" />{CONTACT.email}</a>
            <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="mt-2.5 inline-flex items-center gap-2.5 text-[15px] text-white hover:text-sky-300"><Phone className="h-4 w-4 shrink-0" aria-hidden="true" />{CONTACT.phone}</a>
          </div>
        </div>
        <div className="relative border-t border-white/10">
          <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-sm text-navy-200 md:flex-row">
            <p>© {new Date().getFullYear()} {SITE.full}</p>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1" aria-label="Enlaces del pie">
              {[['/cursos', 'Cursos'], ['/verificar', 'Verificar certificado'], ['/terminos', 'Términos'], ['/privacidad', 'Privacidad']].map(([to, l]) => <Link key={to} to={to} className="hover:text-white">{l}</Link>)}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}