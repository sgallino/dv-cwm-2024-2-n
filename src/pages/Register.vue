<script>
import BaseHeading1 from '../components/BaseHeading1.vue';
import { register } from '../services/auth';

export default {
    name: 'Register',
    components: { BaseHeading1 },
    data() {
        return {
            formData: {
                email: '',
                password: '',
            },
            loading: false,
        }
    },
    methods: {
        async handleSubmit() {
            this.loading = true;

            try {
                await register({...this.formData});
                // this.$router.push('/mi-perfil');
                this.$router.push('/chat');
            } catch (error) {
                // TODO: Manejar el error para dar un mensaje de feedback.
            }

            this.loading = false;
        }
    }
}
</script>

<template>
    <BaseHeading1>Crear Cuenta</BaseHeading1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="email" class="block mb-2">Email</label>
            <input
                type="email"
                id="email"
                class="w-full p-2 border border-gray-400 rounded"
                v-model="formData.email"
            >
        </div>
        <div class="mb-4">
            <label for="password" class="block mb-2">Contraseña</label>
            <input
                type="password"
                id="password"
                class="w-full p-2 border border-gray-400 rounded"
                v-model="formData.password"
            >
        </div>
        <button
            type="submit"
            class="py-2 px-4 rounded bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900 text-white"
        >Registrarme</button>
    </form>
</template>