<!-- <script>
import BaseLoader from './BaseLoader.vue';

export default {
    name: 'LoadingContext',
    props: {
        loading: {
            type: Boolean,
            default: false,
        }
    },
    components: { BaseLoader }
}
</script> -->
<script setup>
import BaseLoader from './BaseLoader.vue';

// Para definir las propiedades que un componente puede recibir, tenemos
// que usar la "macro" defineProps().
// Recibe como parámetro lo mismo que asignaríamos a la propiedad "props"
// en la Options API.
// Retorna un objeto con las propiedades, que solo necesitamos capturar
// si queremos usarlas dentro de la etiqueta <script>.
// Si, en cambio, solo queremos usar las propiedades para el <template>,
// entonces podemos omitir la captura del retorno. Las propiedades 
// definidas en defineProps() están automáticamente disponibles en el
// <template>.
defineProps({
    loading: {
        type: Boolean,
        default: false,
    }
});
</script>

<template>
    <div 
        v-if="loading"
        class="flex justify-center p-4"
    >
        <BaseLoader />
    </div>
    <template v-else>
        <slot />
    </template>
</template>