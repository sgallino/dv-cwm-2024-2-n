<script setup>
import BaseHeading1 from '../components/BaseHeading1.vue';
import LoadingContext from '../components/LoadingContext.vue';
import ProfileData from '../components/profile/ProfileData.vue';
import useUserProfile from '../composables/useUserProfile';
import { useRoute } from 'vue-router';

const route = useRoute();

const { loadingUser, user } = useUserProfile(route.params.id);
</script>

<template>
    <!-- <div 
        v-if="loadingUser"
        class="flex justify-center p-4"
    >
        <BaseLoader />
    </div>
    <template v-else> -->
    <LoadingContext :loading="loadingUser">
        <BaseHeading1>Perfil de {{ user.email }}</BaseHeading1>

        <ProfileData :user="user" />

        <hr class="mb-4">

        <router-link
            :to="`/usuario/${user.id}/chat`"
            class="text-blue-700 underline"
        >Chat Privado con {{ user.email }}</router-link>
    </LoadingContext>
    <!-- </template> -->
</template>