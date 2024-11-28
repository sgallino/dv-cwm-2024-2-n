<script setup>
import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseLoader from '../components/BaseLoader.vue';
import useAuth from '../composables/useAuth';
import useUserProfile from '../composables/useUserProfile';
import { savePrivateChatMessage, subscribeToPrivateChatMessages } from '../services/private-chat';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { formatDate } from '../libraries/date';
import { onUnmounted } from 'vue';

const route = useRoute();

const { loggedUser } = useAuth();
const { user, loadingUser } = useUserProfile(route.params.id);
const { newMessage, handleSubmit } = usePrivateChatForm(loggedUser.value.id, route.params.id);
const { messages, loadingMessages } = usePrivateChatMessages(loggedUser.value.id, route.params.id);

function usePrivateChatMessages(senderId, receiverId) {
    const messages = ref([]);
    const loadingMessages = ref(true);

    let unsubscribe = () => {};

    // Englobamos el código que requiere de asincronidad en una función
    // asíncrona que ejecutamos a continuación inmediatamente.
    // De esta forma, podemos sacar provecho al async/await sin necesitar
    // transformar a async la función contenedora.
    async function fetchMessages() {
        unsubscribe = await subscribeToPrivateChatMessages(
            senderId,
            receiverId,
            newMessages => {
                loadingMessages.value = false;
                messages.value = newMessages;
            }
        );
    }
    fetchMessages();

    onUnmounted(unsubscribe);

    return {
        messages,
        loadingMessages,
    }
}

function usePrivateChatForm(senderId, receiverId) {
    const newMessage = ref({
        text: '',
    });

    async function handleSubmit() {
        try {
            savePrivateChatMessage(
                senderId,
                receiverId,
                newMessage.value.text
            );
            newMessage.value.text = '';
        } catch (error) {
            // TODO...
            console.error('[PrivateChat handleSubmit] Error al grabar el mensaje privado. ', error);
        }
    }

    return {
        newMessage,
        handleSubmit,
    }
}
</script>

<template>
    <div 
        v-if="loadingUser || loadingMessages"
        class="flex justify-center p-4"
    >
        <BaseLoader />
    </div>
    <template v-else>
        <BaseHeading1>Chat Privado con {{ user.email }}</BaseHeading1>

        <section class="mb-4">
            <h2 class="sr-only">Mensajes</h2>

            <div class="min-h-[300px] p-4 border border-gray-800 rounded">
                <ul class="flex flex-col items-start gap-2">
                    <li
                        v-for="message in messages"
                        class="p-4 rounded"
                        :class="{
                            'bg-gray-300': message.user_id !== loggedUser.id,
                            'bg-green-200 self-end': message.user_id === loggedUser.id,
                            // 'bg-green-200': message.user_id === loggedUser.id,
                            // 'self-end': message.user_id === loggedUser.id,
                        }"
                    >
                        <div>{{ message.text }}</div>
                        <div class="text-sm text-gray-700">{{ formatDate(message.created_at) || 'Enviando...' }}</div>
                    </li>
                </ul>
            </div>
        </section>
        <form 
            action="#"
            class="flex gap-4 items-stretch"
            @submit.prevent="handleSubmit"
        >
            <textarea
                id="text"
                class="w-full p-2 border border-gray-400 rounded"
                aria-label="Mensaje"
                placeholder="Escribir..."
                v-model="newMessage.text"
            ></textarea>
            <button
                type="submit"
                class="py-2 px-4 rounded bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900 text-white"
            >Enviar</button>
        </form>
    </template>
</template>