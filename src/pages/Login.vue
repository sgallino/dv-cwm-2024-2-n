<script setup>
import BaseButton from '../components/BaseButton.vue';
import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseLabel from '../components/BaseLabel.vue';
import BaseAlert from '../components/BaseAlert.vue';
import { login } from '../services/auth';
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { dependencyGlobalFeedbackKey } from '../constants/dependency-keys';

// Pedimos que se nos "inyecte" la dependencia de los mensajes de feedback.
// Esto lo hacemos con la función inject() del core de Vue.
const { updateGlobalFeedback } = inject(dependencyGlobalFeedbackKey);

// Para usar la ruta o el router, tenemos que usamos las funciónes de
// composición de Vue Router: useRoute() y useRouter(), respectivamente.
const router = useRouter();

// Invocamos la función que contiene toda la lógica del formulario de login.
const { formData, loading, feedbackLogin, handleSubmit } = useLoginForm(router);

/**
 * 
 * @param router 
 */
function useLoginForm(router) {
    // Para definir data reactiva, tenemos dos funciones que podemos usar:
    // - ref()
    // - reactive()
    // Ambas permiten generar valores reactivos, aunque "reactive" es mucho
    // más acotado en su uso posible.
    // La recomendación habitual es usar ref().
    const formData = ref({
        email: '',
        password: '',
    });
    const loading = ref(false);
    const feedbackLogin = ref(null);

    async function handleSubmit() {
        // El ".value" es la forma que tenemos para obtener y asignar el valor
        // de una variable reactiva.
        // No podemos usar la variable "sola" directamente para modificar el
        // valor. La razón es que el valor original es "envuelto" en un Proxy.
        feedbackLogin.value = null;

        loading.value = true;

        try {
            await login({...formData.value});
            updateGlobalFeedback({
                message: "¡Hola de vuelta!",
                type: 'success',
            });
            router.push('/mi-perfil');
        } catch (error) {
            feedbackLogin.value = error;
        }

        loading.value = false;
    }

    return {
        formData,
        feedbackLogin,
        loading,
        handleSubmit,
    }
}
</script>

<template>
    <BaseHeading1>Ingresar a tu Cuenta</BaseHeading1>

    <BaseAlert 
        v-if="feedbackLogin"
    >{{ feedbackLogin }}</BaseAlert>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <BaseLabel for="email">Email</BaseLabel>
            <BaseInput
                type="email"
                id="email"
                :readonly="loading"
                v-model="formData.email"
            />
        </div>
        <div class="mb-4">
            <BaseLabel for="password">Contraseña</BaseLabel>
            <BaseInput
                type="password"
                id="password"
                :readonly="loading"
                v-model="formData.password"
            />
        </div>
        <BaseButton :loading="loading">Ingresar</BaseButton>
    </form>
</template>