import { onUnmounted, ref } from "vue";
import { subscribeToAuthChanges } from "../services/auth";

export default function useAuth() {
    const loggedUser = ref({
        id: null,
        email: null,
        displayName: null,
        bio: null,
        career: null,
        photoURL: null,
    });

    let unsubscribeFromAuth = subscribeToAuthChanges(newUserData => loggedUser.value = newUserData);

    // Para las funciones del ciclo de vida de Vue, simplemente tenemos que
    // llamar a las funciones específicas de la API de Vue.
    onUnmounted(() => {
        unsubscribeFromAuth();
    });

    return {
        loggedUser,
    }
}