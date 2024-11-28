<script>
import BaseHeading1 from '../components/BaseHeading1.vue';
import { editMyProfile, subscribeToAuthChanges } from '../services/auth';

let unsubscribeFromAuth = () => {}

export default {
    name: 'MyProfileEdit',
    components: { BaseHeading1 },
    data() {
        return {
            editData: {
                displayName: '',
                bio: '',
                career: '',
            },
            saving: false,
        }
    },
    methods: {
        async handleSubmit() {
            // Si está procesando la edición, no hacemos nada.
            if(this.saving) return;

            this.saving = true;

            try {
                await editMyProfile({
                    ...this.editData,
                });
            } catch (error) {
                // TODO: Manejar el error...
            }

            this.saving = false;
        }
    },
    mounted() {
        unsubscribeFromAuth = subscribeToAuthChanges(userData => {
            // Seteamos los valores iniciales del form.
            this.editData = {
                displayName: userData.displayName,
                bio: userData.bio,
                career: userData.career,
            }
        });
    },
    unmounted() {
        unsubscribeFromAuth();
    }
}
</script>

<template>
    <BaseHeading1>Editar Mi Perfil</BaseHeading1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-4">
            <label for="bio" class="block mb-2">Biografía</label>
            <textarea
                id="bio"
                class="w-full min-h-7 p-2 border border-gray-400 rounded read-only:bg-gray-200"
                :readonly="saving"
                v-model="editData.bio"
            ></textarea>
        </div>
        <div class="mb-4">
            <label for="displayName" class="block mb-2">Nombre de Usuario</label>
            <input
                type="text"
                id="displayName"
                class="w-full p-2 border border-gray-400 rounded read-only:bg-gray-300"
                :readonly="saving"
                v-model="editData.displayName"
            >
        </div>
        <div class="mb-4">
            <label for="career" class="block mb-2">Carrera</label>
            <input
                type="text"
                id="career"
                class="w-full p-2 border border-gray-400 rounded read-only:bg-gray-200"
                :readonly="saving"
                v-model="editData.career"
            >
        </div>
        <button
            type="submit"
            class="py-2 px-4 rounded bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900 text-white"
        >
            {{ !saving ? 'Actualizar Mi Perfil' : 'Grabando cambios...' }}
        </button>
    </form>
</template>