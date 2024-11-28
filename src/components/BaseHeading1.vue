<template>
    <!-- 
    El slot define un componente que es reemplazado por el contenido
    que se ponga dentro de la llamada de este componente. 
    Por ejemplo, si llaman a:
        <BaseHeading1>Hola :D</BaseHeading1>
    Entonces <slot /> va a reemplazarse por:
        Hola :D
    -->
    <h1 class="text-3xl mb-4"><slot /></h1>
</template>