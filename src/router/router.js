/*
Archivo de creación y configuración de nuestro router.
*/
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { subscribeToAuthChanges } from '../services/auth';
import Home from '../pages/Home.vue';
import Chat from '../pages/Chat.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import MyProfile from '../pages/MyProfile.vue';
import MyProfileEdit from '../pages/MyProfileEdit.vue';
import MyProfileEditPhoto from '../pages/MyProfileEditPhoto.vue';
import UserProfile from '../pages/UserProfile.vue';
import PrivateChat from '../pages/PrivateChat.vue';

// Definimos las rutas.
const routes = [
    { path: '/',                        component: Home, },
    { path: '/registro',                component: Register, },
    { path: '/iniciar-sesion',          component: Login, },
    { path: '/chat',                    component: Chat,                meta: { requiresAuth: true } },
    { path: '/mi-perfil',               component: MyProfile,           meta: { requiresAuth: true } },
    { path: '/mi-perfil/editar',        component: MyProfileEdit,       meta: { requiresAuth: true } },
    { path: '/mi-perfil/editar/foto',   component: MyProfileEditPhoto,  meta: { requiresAuth: true } },
    { path: '/usuario/:id',             component: UserProfile,         meta: { requiresAuth: true } },
    { path: '/usuario/:id/chat',        component: PrivateChat,         meta: { requiresAuth: true } },
];

// Creamos el router.
// Esto requiere de dos propiedades: routes y history.
// Para el modo de history tenemos dos opciones:
// - createWebHashHistory
//  Maneja la navegación usando el "hash" ("#") de la URL.
// - createWebHistory
//  Maneja la navegación usando la API de History. En este caso, las rutas
//  se ven como páginas comunes y corrientes.
// Desde el punto de vista del SEO, es infinitamente mejor el 
//  createWebHistory. A los buscadores no le gustan los datos extras de la
//  URL, como el query string o el hash. Pero peor aún, con el
//  createWebHashHistory lo único que cambia es el hash. Es decir, la página
//  que se accediendo es siempre la raíz.
// Sabiendo esto, ¿por qué podríamos querer en alguna circunstancia usar
//  el createWebHashHistory?
// La razón por la que podemos llegar a preferirlo, es porque para que
//  createWebHistory funcione correctamente, necesita configurarse 
//  especialmente el servidor.
const router = createRouter({
    // routes: routes,
    routes,
    history: createWebHashHistory(),
    // history: createWebHistory(),
});

// Obtenemos el usuario autenticado (o no).
let loggedUser = {
    id: null,
    email: null,
}

subscribeToAuthChanges(newUserData => loggedUser = newUserData);

// Agregamos una restricción de acceso a las rutas que requieren
// estar autenticado.
router.beforeEach((to, from) => {
    // console.log("Tratando de ingresar a la siguiente ruta: ", to);
    if(to.meta.requiresAuth && loggedUser.id === null) {
        // El usuario no puede ingresar a esta ruta sin estar autenticado,
        // así que lo redireccionamos al login.
        return {
            path: '/iniciar-sesion'
        };
    }
});

// Exportamos el router.
export default router;