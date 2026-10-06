import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Private } from './auth.jsx';
import { PageLoader } from './ui.jsx';
import Layout from './Layout.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import { Login, Register, Forgot, Reset } from './pages/Auth.jsx';
import Checkout from './pages/Checkout.jsx';
import Account from './pages/Account.jsx';
import Verify from './pages/Verify.jsx';
import { Contact, Terms, Privacy, NotFound } from './pages/Static.jsx';
import LayoutClases from './clases-online/LayoutClases.jsx';
import Tablero from './clases-online/Tablero.jsx';
import CursoEnVivo from './clases-online/CursoEnVivo.jsx';

const Classroom = lazy(() => import('./pages/Classroom.jsx'));

export default function App() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 50);
    else if (!pathname.startsWith('/aula/')) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/aula/:slug/:lessonId?" element={<Private><Classroom /></Private>} />
        <Route element={<LayoutClases />}>
          <Route path="/clases-en-vivo" element={<Tablero />} />
          <Route path="/clases-en-vivo/:slug/:seccion?" element={<CursoEnVivo />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cursos" element={<Catalog />} />
          <Route path="/cursos/:slug" element={<CourseDetail />} />
          <Route path="/ingresar" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar" element={<Forgot />} />
          <Route path="/restablecer/:token" element={<Reset />} />
          <Route path="/comprar/:slug" element={<Private><Checkout /></Private>} />
          <Route path="/mi-cuenta/:tab?" element={<Private><Account /></Private>} />
          <Route path="/verificar/:code?" element={<Verify />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/terminos" element={<Terms />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
