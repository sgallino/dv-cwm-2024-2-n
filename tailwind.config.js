/** @type {import('tailwindcss').Config} */
export default {
  // "content" define la lista de archivos/rutas que Tailwind debe observar
  // para identificar qué clases del framework estamos usando.
  content: [
    // Primero, incluimos nuestro index.
    "./index.html",
    // Luego, incluimos todos los archivos que tengan extensión vue, js,
    // jsx, ts o tsx, si importar su nombre, que existan en la carpeta
    // "src/" o en cualquiera de sus subcarpetas (indicado por el "**/").
    "./src/**/*.{vue,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        // Esto registra la clase h-25
        '25': '6.25rem',
      },
      gridTemplateRows: {
        'layout': '64px 1fr 100px',
      }
    },
  },
  plugins: [],
}

