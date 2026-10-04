import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react';
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
      <footer className="bg-navy-900 text-navy-100">
        <div className="container-x grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-sm text-[15px] text-navy-200">Aprendizaje práctico para avanzar con confianza, desde cualquier lugar del Perú.</p>
          </div>
          <FooterCol title="Plataforma" links={[['/cursos', 'Cursos'], ['/#como-funciona', 'Cómo funciona'], ['/#preguntas', 'Preguntas frecuentes'], ['/contacto', 'Contacto']]} />
          <FooterCol title="Legal" links={[['/terminos', 'Términos'], ['/privacidad', 'Privacidad'], ['/verificar', 'Verificar certificado']]} />
        </div>
        <div className="border-t border-white/10 py-5 text-center text-sm text-navy-200">© {new Date().getFullYear()} {SITE.full}. Todos los derechos reservados.</div>
      </footer>
    </div>
  );
}
const FooterCol = ({ title, links }) => (
  <div>
    <p className="font-display font-bold text-white">{title}</p>
    <ul className="mt-3 space-y-2 text-[15px]">{links.map(([to, l]) => <li key={to}><Link to={to} className="text-navy-200 hover:text-white">{l}</Link></li>)}</ul>
  </div>
);
