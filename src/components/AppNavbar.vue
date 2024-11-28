<script setup>
import { useRouter } from 'vue-router';
import useAuth from '../composables/useAuth';
import { logout } from '../services/auth';

const router = useRouter();

const { loggedUser } = useAuth();

function handleLogout() {
    logout();
    // Redireccionamos al login.
    router.push('/iniciar-sesion');
}
</script>

<template>
    <!-- 
    La mayoría de los estilos que permiten un valor que sea un número más
    una unidad, suelen incluir en Tailwind la posibilidad de indicar el
    valor con número que representa un múltiplo de ".25rem".
    Por ejemplo, clases como p- (para padding) m- (para margin), w- (para 
    width).
    Esto da lugar a clases como:
        .p-1 => padding: .25rem;
        .p-2 => padding: .5rem;
        .p-3 => padding: .75rem;
        .p-4 => padding: 1rem;
        .p-5 => padding: 1.25rem;
        .p-8 => padding: 2rem;

    Breve repaso de em/rem:
    "em" (que viene de la letra "m") es una unidad de medida relativa al
    tamaño de la fuente tipográfica del elemento.
    En la mayoría de los browsers, por defecto esto es 16px.
    ¿Cuándo debemos usar em o rem? Como mínimo, para el tamaño de la 
    tipografía.
    ¿Por qué? Si sabemos que 1em ~= 16px, ¿por qué ponemos 1em en vez de
    16px? ¿No es lo mismo?
    No, no es lo mismo. De hecho, es MUY diferente.
    Los píxeles son "unidades absolutas". Los em/rem son "unidades relativas".
    -->
    <nav class="flex justify-between items-center p-4 bg-slate-300 text-slate-800">
        <router-link to="/" class="text-xl">DV Social</router-link>

        <ul class="flex gap-4">
            <li><router-link class="block py-1 px-2" to="/">Home</router-link></li>
            <template v-if="loggedUser.id !== null">
                <li><router-link class="block py-1 px-2" to="/chat">Chat</router-link></li>
                <li><router-link class="block py-1 px-2" to="/mi-perfil">Mi Perfil</router-link></li>
                <li>
                    <form
                        action="#"
                        @submit.prevent="handleLogout"
                    >
                        <button type="submit" class="block py-1 px-2">{{ loggedUser.email }} (Cerrar Sesión)</button>
                    </form>
                </li>
            </template>
            <template v-else>
                <li><router-link class="block py-1 px-2" to="/registro">Registrarse</router-link></li>
                <li><router-link class="block py-1 px-2" to="/iniciar-sesion">Iniciar Sesión</router-link></li>
            </template>
        </ul>
    </nav>
</template>