// Marco de "Clases en vivo": barra lateral con iconos y, a la derecha, la página. No lleva pie de página.
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Award, BookOpen, CircleHelp, CircleUserRound, Gauge, LogOut, MonitorPlay } from 'lucide-react';

const ITEMS = [
  ['/mi-cuenta', CircleUserRound, 'Cuenta'],
  ['/clases-en-vivo', Gauge, 'Tablero', true],
  ['/cursos', MonitorPlay, 'Cursos'],
  ['/mi-cuenta/certificados', Award, 'Certificados'],
  ['/contacto', CircleHelp, 'Ayuda'],
];

export default function LayoutClases() {
  return (
    <div className="min-h-screen bg-white lg:pl-[104px]">
      <aside className="sticky top-0 z-40 flex items-center gap-1 overflow-x-auto bg-navy-900 px-2 py-1.5 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-[104px] lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:py-0" aria-label="Clases en vivo">
        <Link to="/" aria-label="Aula Pro Online, ir al inicio" className="flex shrink-0 items-center justify-center p-2 lg:w-full lg:py-5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500"><BookOpen className="h-6 w-6" /></span></Link>
        {ITEMS.map(([to, Icon, label, tablero]) => (
          <NavLink key={to} to={to} end={!tablero} className={({ isActive }) => `flex shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-semibold lg:w-full lg:rounded-none lg:px-1 lg:py-3.5 lg:text-sm ${isActive && tablero ? 'bg-white text-navy-900' : 'hover:bg-white/15'}`}>
            <Icon className="h-6 w-6 lg:h-7 lg:w-7" aria-hidden="true" />{label}</NavLink>))}
        <Link to="/" className="ml-auto flex shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-semibold hover:bg-white/15 lg:ml-0 lg:mt-auto lg:w-full lg:rounded-none lg:py-4 lg:text-sm"><LogOut className="h-6 w-6 rotate-180" aria-hidden="true" />Salir</Link>
      </aside>
      <Outlet />
    </div>
  );
}
