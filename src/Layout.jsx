import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogOut, Mail, Menu, Phone, User, X } from 'lucide-react';
import { useAuth } from './auth.jsx';
import { ADMIN_URL, SITE } from './api.js';
import { CONTACT, SOCIAL } from './contacto.jsx';

export const Logo = ({ light }) => (
  <Link to="/" className="flex items-center gap-2.5" aria-label={`${SITE.full}, inicio`}>
    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-white"><BookOpen className="h-5 w-5" aria-hidden="true" /></span>
    <span className={`font-display text-xl font-extrabold ${light ? 'text-white' : 'text-navy-900'}`}>
      {SITE.first} <span className={light ? '' : 'text-brand-500'}>{SITE.accent}</span> {SITE.last}
    </span>
  </Link>
);
const NAV = [['/', 'Inicio'], ['/cursos', 'Cursos'], ['/clases-en-vivo', 'Clases en vivo'], ['/#como-funciona', 'Cómo funciona'], ['/contacto', 'Contacto']];

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
      {loc.pathname === '/contacto' ? (
        // En la página de contacto: cierre sencillo en lugar del pie de página completo
        <footer className="bg-white pb-8 pt-2 text-center">
          <div className="mx-auto mb-5 h-1 w-16 rounded-full bg-gradient-to-r from-brand-500 to-navy-900" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-700">© {new Date().getFullYear()} {SITE.full}</p>
          <nav className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm font-semibold text-navy-900" aria-label="Enlaces">
            {[['/cursos', 'Cursos'], ['/verificar', 'Verificar certificado'], ['/terminos', 'Términos'], ['/privacidad', 'Privacidad']].map(([to, l]) => <Link key={to} to={to} className="hover:text-brand-500 hover:underline">{l}</Link>)}
          </nav>
        </footer>
      ) : (
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
      )}
    </div>
  );
}
