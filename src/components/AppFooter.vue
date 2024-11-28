<template>
    <!-- 
    Nosotros especificamos originalmente el alto del footer en 100px.
    Sin embargo, Tailwind no contempla en sus clases este número. Lo más 
    cercano es la clase h-24 que son 96px.
    ¿Qué pasa si necesitamos sí o sí que sean 100px?
    Tenemos 3 opciones:
    1. Saltearnos Tailwind, y crear una clase propia con ese tamaño. No es lo
        más recomendado.
    2. Usando valores arbitrarios o "one-off" (única vez).
        Tailwind nos permite, en los lugares donde se incluye el valor del
        estilo, escribir un valor arbitrario entre [].
        Esto es especialmente útil en los casos donde tenemos que usar un
        valor que no se repite en ningún otro lado.
    3. Registrar el nuevo valor en el tailwind.config.js.
        Esto es mucho más útil si es un valor que necesitamos referenciar
        múltiples veces, o si simplemente queremos darle un nombre algo más
        descriptivo.
    -->
    <!-- <footer class="flex justify-center items-center h-[6.25rem] bg-slate-900 text-white"> -->
    <footer class="flex justify-center items-center h-25 bg-slate-900 text-white">
        <p>Copyright &copy; Da Vinci 2024</p>
    </footer>
</template>