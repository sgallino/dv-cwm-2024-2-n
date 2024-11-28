import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, editUserProfile, getUserProfileById } from "./user-profiles";
import { getFileURL, uploadFile } from "./file-storage";

const AUTH_ERROR_MESSAGES_MAP = {
    'auth/invalid-email': 'El email no tiene un formato correcto.',
    'auth/weak-password': 'El password debe tener la menos 6 caracteres.',
    'auth/invalid-credential': 'Las credencial es ingresadas no coinciden con nuestros registros.',
}

let loggedUser = {
    id: null,
    email: null,
    displayName: null,
    bio: null,
    career: null,
    photoURL: null,
}

// Verificamos si figura que el usuario ya está autenticado, en cuyo caso
// lo marcamos como autenticado.
if(localStorage.getItem('user')) {
    loggedUser = JSON.parse(localStorage.getItem('user'));
}

// Array para los observers.
let observers = [];

// Pedimos obtener el estado de autenticación del usuario.
// Si está autenticado, obtenemos los datos.
// onAuthStateChanged setea un "observer" que se ejecuta
// cada vez que el estado de autenticación cambie. Esto es,
// cuando no estamos autenticados y pasamos a estarlo; cuando
// estamos autenticados y pasamos a no estarlo; o si estoy
// autenticado con una cuenta y cambio de cuenta.
// La función recibe la referencia de Authentication y un
// callback. Este callback recibe a su vez un objeto User o
// null.
onAuthStateChanged(auth, user => {
    if(user) {
        // Obtenemos los datos disponibles en Authentication.
        updateLoggedUser({
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        });

        // console.log("Usuario autenticado con éxito.");

        // Ahora dejamos cargando los datos del perfil completo.
        getUserProfileById(user.uid)
            .then(profile => {
                updateLoggedUser({
                    bio: profile.bio,
                    career: profile.career,
                });
            });
    } else {
        updateLoggedUser({
            id: null,
            email: null,
            displayName: null,
            bio: null,
            career: null,
            photoURL: null,
        });
        localStorage.removeItem('user');
    }
});

/**
 * 
 * @param {{email: string, password: string}} credentials
 */
export async function register({email, password}) {
    try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        
        await createUserProfile(credentials.user.uid, { email });
    } catch (error) {
        console.error("[auth.js login] Error al registrar el usuario: ", error);
        throw AUTH_ERROR_MESSAGES_MAP[error.code];
    }
}

/**
 * 
 * @param {{email: string, password: string}} credentials
 */
export async function login({email, password}) {
    try {
        // Tratamos de autenticar usando la función de Firebase Auth:
        // signInWithEmailAndPassword().
        // Recibe 3 parámetros:
        // 1. La referencia a la autenticación de Firebase.
        // 2. El email.
        // 3. El password.
        // Retorna una Promise que se resuelve con una instacia de
        // UserCredentials.
        // Si la autenticación falla, la Promise se rechaza con
        // mensaje de error.
        const user = await signInWithEmailAndPassword(auth, email, password);
        // console.log("Usuario autenticado: ", user);
    } catch (error) {
        console.error("[auth.js login] Error al autenticar: ", error);
        throw AUTH_ERROR_MESSAGES_MAP[error.code] || error.message;
    }
}

/**
 * 
 * @param {{displayName: string, bio: string, career: string}} data
 */
export async function editMyProfile({ displayName, bio, career }) {
    try {
        // Editamos el perfil del usuario en Authentication y en Firestore.
        // updateProfile actualiza el displayName y photoURL del usuario.
        // Estos son los únicos dos datos que Firebase Authentication
        // acepta almacenar.
        const promiseAuth = updateProfile(auth.currentUser, { displayName });

        const promiseFirestore = editUserProfile(loggedUser.id, { displayName, bio, career });

        // Esperamos que ambas promesas se completen con ayuda de Promise.all().
        await Promise.all([promiseAuth, promiseFirestore]);

        // Actualizamos loggedUser con los datos nuevos.
        updateLoggedUser({
            displayName,
            bio,
            career,
        });
    } catch (error) {
        console.error("[auth.js editMyProfile] Error al editar el perfil: ", error);
        throw error;
    }
}

/**
 * 
 * @param {File} photo 
 */
export async function editMyProfilePhoto(photo) {
    try {
        // Creamos la ruta donde guardar el archivo.
        // Vamos a crear una carpeta "users", donde cada usuario va a tener
        // una subcarpeta con el nombre de su "id" para los archivos que
        // les corresponden.
        const filepath = `users/${loggedUser.id}/avatar.jpg`; // TODO: Considerar otras extensiones

        await uploadFile(filepath, photo);

        // Ahora necesitamos obtener la URL de la foto para poder grabarla
        // en los datos del usuario.
        const photoURL = await getFileURL(filepath);

        const promiseAuth = updateProfile(auth.currentUser, { photoURL });
        const promiseFirestore = editUserProfile(loggedUser.id, { photoURL });

        await Promise.all([promiseAuth, promiseFirestore]);

        updateLoggedUser({ photoURL });
    } catch (error) {
        console.error("[auth.js editMyProfilePhoto] Error al editar la foto de perfil: ", error);
        throw error;
    }
}

/**
 * Cierra la sesión.
 */
export async function logout() {
    await signOut(auth);
}

/*----------------------------------------------------------
| Patrón de Diseño: Observer
+-----------------------------------------------------------
| Un patrón de diseño es una práctica común para resolver un
| determinado problema en programación.
| Los patrones más conocidos son estrategias comunes que se
| implementan con frecuencia en distintos proyectos o lugares
| de un proyecto.
|
| En este caso, nos interesa hablar del patrón Observer.
| Observer sirve para definir una relación de uno a muchos.
| Donde tenemos muchas clases/funciones/elementos (llamados
| los "observers") que quieren ser notificados de los cambios
| u ocurrencias sucedidas en una clase/función/elemento 
| externo (llamado el "subject").
|
| En este patrón, la mayoría del trabajo está en los hombros
| del subject.
| El subject debe ofrecer un mecanismo por el cual los 
| "observers" puedan "suscribirse" para ser notificados de los
| cambios o sucesos del subject. Esto, típicamente, es aceptando
| un objeto de una clase con una interfaz específica, o en
| programación no OOP, podemos simplemente aceptar un callback.
| El subject debe guardar todos esos observers en algún tipo
| de lista (como un array), y asegurarse de que cada vez que
| ocurran los ya mencionamos cambios o sucesos, se informe a
| cada uno de los observers.
|
| Es decir, vamos a tener que:
| - Crear en el subject una función para suscribirse.
| - Crear funciones para notificar a los observers.
| - Ejecutar esas funciones cada vez que algo cambie y ocurra.
|
| Nota: Si bien el término más común es "subscribe", algunas
| implementaciones lo llaman "attach" o "listen".
+-----------------------------------------------------------*/
/**
 * 
 * @param {Function} callback - El Observer a asociar.
 * @returns {Function} Función para cancelar la suscripción del Observer.
 */
export function subscribeToAuthChanges(callback) {
    observers.push(callback);

    // console.log("Observer agregado. El stack actual es: ", observers);

    // Inmediatamente, notificamos los valores actuales del estado
    // de autenticación.
    notify(callback);

    // Retornamos una nueva función que al ejecutarse cancele la suscripción
    // del callback recién agregado.
    return () => {
        // Eliminamos el callback del array de observers.
        observers = observers.filter(obs => obs !== callback);
        // console.log("Observer eliminado. El stack actual es: ", observers);
    }
}

/**
 * Ejecuta el callback del observer y le pasa una copia de los
 * datos del usuario autenticado (o no autenticado).
 * 
 * @param {Function} callback 
 */
function notify(callback) {
    // console.log("Notificando a un observer...");
    callback({...loggedUser});
}

/**
 * Notifica a todos los observers.
 */
function notifyAll() {
    observers.forEach(callback => notify(callback));
}

/**
 * Actualiza la data del usuario autenticado.
 * 
 * @param {{}} newData 
 */
function updateLoggedUser(newData) {
    loggedUser = {
        ...loggedUser,
        ...newData,
    }
    localStorage.setItem('user', JSON.stringify(loggedUser));
    notifyAll();
}