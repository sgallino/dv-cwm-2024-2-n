<script setup>
import BaseHeading1 from '../components/BaseHeading1.vue';
import ProfileData from '../components/profile/ProfileData.vue';
import useAuth from '../composables/useAuth';

const { loggedUser } = useAuth();
</script>

<template>
    <div class="flex items-end gap-4">
        <BaseHeading1>Mi Perfil</BaseHeading1>
        <router-link 
            to="/mi-perfil/editar"
            class="mb-4 text-blue-700 underline"
        >Editar</router-link>
        <router-link 
            to="/mi-perfil/editar/foto"
            class="mb-4 text-blue-700 underline"
        >Editar Foto</router-link>
    </div>

    <ProfileData :user="loggedUser" />
</template>