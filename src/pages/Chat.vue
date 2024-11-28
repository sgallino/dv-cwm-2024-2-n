<script setup>
import BaseHeading1 from '../components/BaseHeading1.vue';
import useAuth from '../composables/useAuth';
import LoadingContext from '../components/LoadingContext.vue';
import { ref, onUnmounted } from 'vue';
import { savePublicChatMessage, subscribeToPublicChatMessages } from '../services/public-chat';
import { formatDate } from '../libraries/date';

const { loggedUser } = useAuth();
const { loading, messages } = usePublicChatMessages();
const { newMessage, handleSubmit } = usePublicChatForm(loggedUser);

function usePublicChatMessages() {
    const messages = ref([]);
    const loading = ref(true);

    let unsubscribe = subscribeToPublicChatMessages(newMessages => {
        messages.value = newMessages;
        loading.value = false;
    });

    onUnmounted(unsubscribe);

    return {
        messages,
        loading,
    }
}

function usePublicChatForm(user) {
    const newMessage = ref({
        text: '',
    });

    async function handleSubmit() {
        savePublicChatMessage({
            // ...this.newMessage,
            // Los "..." acá son el "object spread operator"
            // (operador de esparcimiento de objeto).
            // Este operador se puede usar dentro de la definición
            // de un objeto o array, y es una forma abreviada de
            // crear una copia de todas las propiedades y/o
            // valores.
            
            // Esto:
            //...this.newMessage,

            // Es igual a esto:
            user_id: user.value.id,
            email: user.value.email,
            text: newMessage.value.text,
        });

        newMessage.value.text = "";
    }

    return {
        newMessage,
        handleSubmit,
    }
}
</script>

<template>
    <BaseHeading1>Chat Público</BaseHeading1>

    <div class="flex gap-4">
        <section class="w-3/4">
            <h2 class="sr-only">Mensajes</h2>

            <div class="min-h-40 p-4 border border-gray-800 rounded">
                <LoadingContext :loading="loading">
                    <ul class="flex flex-col items-start gap-2">
                        <li
                            v-for="message in messages"
                            class="p-4 rounded bg-gray-300"
                        >
                            <div>
                                <router-link
                                    :to="`/usuario/${message.user_id}`"
                                    class="font-bold text-blue-700 underline"
                                >{{ message.email }}</router-link> 
                                escribió:
                            </div>
                            <div>{{ message.text }}</div>
                            <div class="text-sm text-gray-700">{{ formatDate(message.created_at) || 'Enviando...' }}</div>
                        </li>
                    </ul>
                </LoadingContext>
            </div>
        </section>
        <section class="w-1/4">
            <h2 class="mb-4 text-xl">Enviar un mensaje</h2>

            <form
                action="#"
                @submit.prevent="handleSubmit"
            >
                <div class="mb-4">
                    <span class="block mb-2">Email</span>
                    {{ loggedUser.email }}
                </div>
                <div class="mb-4">
                    <label for="text" class="block mb-2">Mensaje</label>
                    <textarea
                        id="text"
                        class="w-full min-h-7 p-2 border border-gray-400 rounded"
                        v-model="newMessage.text"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    class="py-2 px-4 rounded bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900 text-white"
                >Enviar</button>
            </form>
        </section>
    </div>
</template>