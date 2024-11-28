/*
# Estructura del chat privado en Firestore
Para poder guardar la info de los chats privados, hay dos cosas que
necesitamos registrar:

- Los ids de los usuarios que participan en el chat (en nuestro caso, siempre
    van a ser 2).
- Los mensajes de chat (que pueden ser X).

Por lo menos, esos son los datos "complejos" que tenemos que guardar.
Para ayudarnos a elegir cómo nos pueden convenir modelar este tipo de data,
Firestore tiene un pequeño documento de guía:
https://firebase.google.com/docs/firestore/manage-data/structure-data

A partir de la info que ahí nos brindan, podemos concluir que las estrategias
óptimas para nuestros casos de uso son:

- Para los ids de los usuarios, vamos a usar un mapa dentro del documento.
- Para los mensajes de chat, vamos a crear una subcollection dentro del
documento.

La estructura va a tomar la siguiente forma:
[C] => Collection
[D] => Document

[C] private-chats {
    [D] idChat1 {
        users: {
            [idUser1]: true,
            [idUser2]: true,
        }

        [C] messages {
            [D]: idMessage1 {
                user_id: ...,
                text: ...,
                created_at: ...
            }

            ...
        }
    }

    ...
}

Noten que en los usuarios, los ids los vamos a utilizar como *claves*, y 
no como valores. Los valores va a ser simplemente true.
*/
import { DocumentReference, addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "./firebase";

// Vamos a armar un simple sistemita para cachear los documentos de conversaciones
// privadas.
/**
 * Guarda los documentos de los chats privados.
 * Las claves del objeto van a tener el formato de los dos ids de los
 * usuarios ordenados y unidos por un "_".
 * 
 * Por ejemplo, si los ids son:
 * User1: asd
 * User2: zxc
 * Clave: asd_zxc
 * 
 * User1: zxc
 * User2: asd
 * Clave asd_zxc
 * 
 * @type {Object}
 */
let cacheChats = {};

/**
 * Retorna la clave del caché para la conversación entre estos dos usuarios.
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns 
 */
function getCacheKey(senderId, receiverId) {
    return [senderId, receiverId].sort().join("_");
}

/**
 * 
 * @param {string} key 
 * @param {any} value 
 */
function putInCache(key, value) {
    cacheChats[key] = value;
}

/**
 * 
 * @param {string} key 
 * @returns {any}
 */
function retrieveFromCache(key) {
    return cacheChats[key] || null;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<DocumentReference>}
 */
async function getChatDocument(senderId, receiverId) {
    // Preguntamos si existe en el caché la conversación.
    const cacheKey = getCacheKey(senderId, receiverId);
    const cacheDoc = retrieveFromCache(cacheKey);

    if(cacheDoc) {
        console.log("Retornando el documento del chat del caché");
        return cacheDoc;
    }

    console.log("Yendo a Firestore a buscar el documento del chat");

    const chatRef = collection(db, 'private-chats');

    // Armamos un query para poder hacer una búsqueda.
    const chatQuery = query(chatRef, where('users', '==', {
        [senderId]: true,
        [receiverId]: true,
    }), limit(1));

    // Realizamos la búsqueda. Para buscar, incluso si sabemos que solo
    // puede haber un documento, necesitamos usar la función getDocs().
    const chatSnapshot = await getDocs(chatQuery);

    // return chatSnapshot.empty  
    //     ? await addDoc(chatRef, {
    //         users: {
    //             [senderId]: true,
    //             [receiverId]: true,
    //         }
    //     })
    //     : chatSnapshot.docs[0];
    let chatDoc;

    if(chatSnapshot.empty) {
        chatDoc = await addDoc(chatRef, {
            users: {
                [senderId]: true,
                [receiverId]: true,
            }
        });
    } else {
        // Pedimos el primer (y único) documento.
        chatDoc = chatSnapshot.docs[0];
    }

    // Guardamos en el caché el chat.
    putInCache(cacheKey, chatDoc);

    return chatDoc;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {string} text 
 */
export async function savePrivateChatMessage(senderId, receiverId, text) {
    // Primero, necesitamos asegurarnos de que exista el documento del
    // chat privado.
    // Buscamos a ver si existe, y si no, la creamos.
    const chatDoc = await getChatDocument(senderId, receiverId);

    // Ahora que tenemos el documento del chat, y principalmente, su id,
    // podemos agregar el mensaje de chat en su subcollection messages.
    const messagesRef = collection(db, `private-chats/${chatDoc.id}/messages`);

    await addDoc(messagesRef, {
        user_id: senderId,
        text,
        created_at: serverTimestamp(),
    });
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {Function} callback 
 * @returns {Promise<import("firebase/firestore").Unsubscribe>}
 */
export async function subscribeToPrivateChatMessages(senderId, receiverId, callback) {
    const chatDoc = await getChatDocument(senderId, receiverId);

    const messagesRef = collection(db, `private-chats/${chatDoc.id}/messages`);

    const messagesQuery = query(messagesRef, orderBy('created_at'));

    return onSnapshot(messagesQuery, snapshot => {
        const messages = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                user_id: doc.data().user_id,
                text: doc.data().text,
                created_at: doc.data().created_at?.toDate(),
            }
        });

        callback(messages);
    });
}