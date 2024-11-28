<script setup>
import AppNavbar from './components/AppNavbar.vue';
import AppFooter from './components/AppFooter.vue';
import { ref, provide } from 'vue';
import { dependencyGlobalFeedbackKey } from './constants/dependency-keys';

const feedback = ref({
    message: null,
    type: 'info',
    title: null,
});

const notificationService = {
    // En este caso, estamos pasando como dato del objeto la referencia en
    // sí. Esto significa que cualquiera de los descendientes de este 
    // componente puede modificar impunemente el valor.
    // Esto es similar a trabajar con variables globales. En el sentido
    // de que si el valor se rompe, puede volverse muy difícil encontrar al
    // responsable.
    // feedback,

    // En su lugar, preferimos que no se mande el valor, sino que mandemos
    // en todo caso métodos que pueden usarse para modificar el valor de
    // una manera controlada por nosotros.
    /**
     * 
     * @param {{message: string|null, type: string, title: string|null}} newData 
     */
    updateGlobalFeedback(newData) {
        // Acá podríamos controlar cuáles datos están newData.
        feedback.value = {
            ...feedback.value,
            ...newData,
        }
    },
    clearGlobalFeedback() {
        this.updateGlobalFeedback({
            message: null,
        });
    },
};

// Definimos un proveedor de dependencias para la data de la notificación.
// Para lograrlo, usamos la función del core de Vue: provide.
// Esta función recibe 2 valores:
// 1. La "key" que identifica a la dependencia.
// 2. El valor. Típicamente, suele ser un objeto.
provide(dependencyGlobalFeedbackKey, notificationService);
</script>

<template>
    <AppNavbar />
    <main class="container p-4 mx-auto">
        <div 
            v-if="feedback.message"
            class="relative p-4 mb-4 bg-green-200 rounded"
        >
            {{ feedback.message }}

            <button 
                type="button"
                class="absolute top-0 right-0 w-12 h-12"
                @click="() => notificationService.clearGlobalFeedback()"
            >&times;</button>
        </div>
        <router-view />
    </main>
    <AppFooter />
</template>