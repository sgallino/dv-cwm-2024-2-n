<script setup>
import AdminNavbar from './AdminNavbar.vue';
import AppFooter from './AppFooter.vue';
</script>

<template>
    <AdminNavbar />
    <main class="content">
        <slot />
    </main>
    <AppFooter />
</template>