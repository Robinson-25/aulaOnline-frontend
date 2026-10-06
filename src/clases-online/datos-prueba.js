// DATOS DE PRUEBA: cursos en vivo de ejemplo para diseñar las pantallas.
// Cuando el backend tenga las clases en vivo, este archivo se reemplaza por llamadas reales.
export const DESCUENTO_ESTUDIANTES = 20; // % de descuento para quien ya compró un curso grabado

const semana = (n, tema, lab) => ({
  title: `SEMANA ${n}: ${tema}`,
  antes: [['enlace', 'Lectura previa'], ['foro', `Semana ${String(n).padStart(2, '0')}: Foro previo`], ['pagina', `Semana ${String(n).padStart(2, '0')}: Video y diapositiva - ${tema}`]],
  durante: [['tarea', `${lab}`, '20 ptos.']],
  despues: [['enlace', 'Material de repaso'], ['pagina', 'Grabación de la clase']],
});

export const CLASES = [
  {
    slug: 'matematica-en-vivo', code: 'MatVivo', title: 'Matemática en vivo: refuerzo escolar', period: 'Ciclo 2026 - 2', tone: 'from-sky-500 to-navy-700',
    welcome: 'Luego de ver la presentación del curso, haz clic en el botón Módulos para revisar tus materiales de estudio y actividades programadas. Recuerda revisar el sílabo y el sistema de evaluación.',
    instructor: 'Robinson W. Biktu', price: 120, start: '2026-10-19', end: '2026-11-13', days: 'Lunes y miércoles', hours: '7:00 p. m. – 8:30 p. m.', seats: 30, taken: 12,
    capacidades: ['Resuelve operaciones con números naturales, fracciones y decimales.', 'Aplica porcentajes en problemas de la vida diaria.', 'Explica el procedimiento que usó para llegar a la respuesta.'],
    silabo: ['Números y operaciones', 'Fracciones', 'Decimales y porcentajes', 'Repaso y evaluación'],
    evaluacion: [['Laboratorios en clase', '40%'], ['Participación en vivo', '20%'], ['Evaluación final', '40%']],
    weeks: [semana(1, 'Números y operaciones', 'Laboratorio 1: Operaciones básicas'), semana(2, 'Fracciones', 'Laboratorio 2: Operaciones con fracciones'), semana(3, 'Decimales y porcentajes', 'Laboratorio 3: Porcentajes'), semana(4, 'Repaso y evaluación', 'Evaluación final en vivo')],
  },
  {
    slug: 'comunicacion-en-vivo', code: 'ComVivo', title: 'Comunicación en vivo: lectura y redacción', period: 'Ciclo 2026 - 2', tone: 'from-rose-500 to-brand-700',
    welcome: 'Revisa los módulos de cada semana antes de entrar a la clase. Encontrarás las lecturas y las actividades que trabajaremos en directo.',
    instructor: 'Robinson W. Biktu', price: 100, start: '2026-10-20', end: '2026-11-12', days: 'Martes y jueves', hours: '6:00 p. m. – 7:30 p. m.', seats: 25, taken: 25,
    capacidades: ['Identifica la idea principal de un texto.', 'Redacta párrafos claros y bien puntuados.', 'Sustenta su opinión con argumentos.'],
    silabo: ['Comprensión lectora', 'Ortografía y puntuación', 'Redacción'],
    evaluacion: [['Trabajos de redacción', '50%'], ['Participación en vivo', '20%'], ['Evaluación final', '30%']],
    weeks: [semana(1, 'Comprensión lectora', 'Laboratorio 1: Idea principal'), semana(2, 'Ortografía y puntuación', 'Laboratorio 2: Tildes y comas'), semana(3, 'Redacción', 'Laboratorio 3: Texto argumentativo')],
  },
  {
    slug: 'excel-en-vivo', code: 'ExcelVivo', title: 'Excel en vivo para el trabajo', period: 'Ciclo 2026 - 2', tone: 'from-emerald-500 to-teal-800',
    welcome: 'Ten Excel abierto en tu computadora durante cada clase: trabajaremos juntos mientras el docente comparte su pantalla.',
    instructor: 'Robinson W. Biktu', price: 150, start: '2026-11-02', end: '2026-11-27', days: 'Sábados', hours: '9:00 a. m. – 12:00 m.', seats: 40, taken: 8,
    capacidades: ['Organiza datos en hojas de cálculo.', 'Usa fórmulas y funciones básicas.', 'Presenta información con tablas y gráficos.'],
    silabo: ['Primeros pasos', 'Fórmulas', 'Tablas y gráficos', 'Proyecto final'],
    evaluacion: [['Laboratorios en clase', '60%'], ['Proyecto final', '40%']],
    weeks: [semana(1, 'Primeros pasos', 'Laboratorio 1: Formato de datos'), semana(2, 'Fórmulas', 'Laboratorio 2: SUMA, PROMEDIO y SI'), semana(3, 'Tablas y gráficos', 'Laboratorio 3: Gráficos'), semana(4, 'Proyecto final', 'Proyecto: Reporte completo')],
  },
];

// Lo que aparece en "Por hacer" y "Valoración reciente" del tablero.
export const POR_HACER = [
  { title: 'Laboratorio 1: Operaciones básicas', course: 'Matemática en vivo', pts: 20, due: '21 de oct. en 23:59', slug: 'matematica-en-vivo' },
  { title: 'Semana 01: Foro previo', course: 'Comunicación en vivo', pts: 5, due: '20 de oct. en 18:00', slug: 'comunicacion-en-vivo' },
  { title: 'Laboratorio 1: Formato de datos', course: 'Excel en vivo', pts: 20, due: '7 de nov. en 23:59', slug: 'excel-en-vivo' },
];
export const VALORACIONES = [
  { title: 'Práctica de diagnóstico', course: 'MatVivo', nota: '18 de 20' },
  { title: 'Foro de bienvenida', course: 'ComVivo', nota: '20 de 20' },
];

export const fechaCorta = (s) => new Date(s + 'T12:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
export const cupos = (c) => Math.max(0, c.seats - c.taken);
