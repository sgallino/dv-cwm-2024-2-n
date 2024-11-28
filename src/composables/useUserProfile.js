import { ref, onMounted } from 'vue';
import { getUserProfileById } from '../services/user-profiles';

export default function useUserProfile(id) {
    const user = ref({
        id: null,
        email: null,
        displayName: null,
        photoURL: null,
        bio: null,
        career: null,
    });
    const loadingUser = ref(false);

    onMounted(async () => {
        loadingUser.value = true;
        user.value = await getUserProfileById (id);
        loadingUser.value = false;
    });

    return {
        loadingUser,
        user,
    }
}