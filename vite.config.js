// Los archivos de configuración deben, generalmente, exportar el objeto de
// configuración.
import vue from '@vitejs/plugin-vue';

export default {
    // Agregamos que se utilice el plugin de Vite. Noten los paréntesis.
    plugins: [vue()],
}