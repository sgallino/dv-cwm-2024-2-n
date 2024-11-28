<script setup>
import BaseLoader from './BaseLoader.vue';

defineProps({
    loading: {
        type: Boolean,
        default: false,
    }
});
</script>

<template>
    <button
        type="submit"
        class="py-2 px-4 rounded bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900 text-white"
    >
        <slot v-if="!loading" />
        <BaseLoader v-else />
    </button>
</template>