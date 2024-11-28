<script setup>
import AppNavbar from './AppNavbar.vue';
import AppFooter from './AppFooter.vue';
</script>

<template>
    <AppNavbar />
    <main class="content">
        <slot />
    </main>
    <AppFooter />
</template>