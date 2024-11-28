<script setup>
// Para que este componente pueda aceptar la directiva v-model de Vue,
// es necesario que implementemos el uso de esa directiva.
// A partir de Vue 3.4, esto es muy simple de lograr.
// Solamente tenemos que llamar a la macro defineModel(), y asignar
// el valor al v-model del campo.
const model = defineModel();
</script>

<template>
    <input
        type="text"
        class="w-full p-2 border border-gray-400 rounded read-only:bg-gray-200"
        v-model="model"
    >
</template>