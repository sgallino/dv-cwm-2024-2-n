import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Guarda en el servidor el mensaje de chat.
 * 
 * @param {{email: string, text: string}} newMessage
 */
export async function savePublicChatMessage({user_id, email, text}) {
    /*
        Vamos a grabar un documento en una colección "public-chat"
        dentro de Firestore, usando los datos del form.
        Para poder hacer esto, vamos a necesitar tener la referencia
        a la base de datos de Firestore. Esta la vamos a importar
        de nuestro archivo [services/firebase.js].
        Usando la conexión a la base de Firestore, podemos crear
        una "referencia" a la "collection" de "public-chat".
        Lo hacemos usando la función "collection()".
    */
    const chatRef = collection(db, 'public-chat');

    /*
        Con la referencia en mano, podemos ahora hacer el insert
        del documento usando el método addDoc().
        Esta función recibe 2 parámetros:
        1. La referencia de la collection donde agregar el documento.
        2. El objeto con los datos para el documento.
        Retorna una Promise que se resuelve cuando termina de grabar.
    */
    addDoc(chatRef, {
        user_id,
        email,
        text,
        // serverTimestamp() indica que el valor de este campo debe
        // completarse en el servidor con la fecha y hora.
        created_at: serverTimestamp(),
    });
}

/**
 * 
 * @param {Function} callback 
 * @returns {import("firebase/firestore").Unsubscribe}
 */
export function subscribeToPublicChatMessages(callback) {
    /*
        Vamos a leer los mensajes de chat.
        Primero, vamos a necesitar la referencia.
    */
    const chatRef = collection(db, "public-chat");

    /*
        Probemos de leer los mensajes usando la función getDocs().
        getDocs recibe una referencia de una colección o un query y
        nos retorna una Promise que se resuelve con un objeto de la
        clase QuerySnapshot.
    */
    // const snapshot = await getDocs(chatRef);

    // console.log("Snapshot: ", snapshot);
    /*
        Ahora que tenemos el "snapshot", podemos pedir obtener los
        documentos a través de la propiedad "docs", que retorna un
        array de objetos QueryDocumentSnapshot.

        Como no nos sirven realmente los QueryDocumentSnapshots, ya que
        son clases propias de Firestore, vamos a transformarlos a objetos
        comunes de JS que contengan los datos de los documentos.
    */
    // this.messages = snapshot.docs.map(doc => {
    //     return {
    //         // Para obtener el id del documento, usamos su propiedad id.
    //         id: doc.id,
    //         // Para obtener los datos del documento tenemos que llamar a
    //         // su método data().
    //         email: doc.data().email,
    //         text: doc.data().text,
    //     }
    // });

    /*
        Queremos traer los mensajes ordenados por su "created_at".
        Para poder aplicar ordenamientos o filtros a una consulta de
        una collection, tenemos que usar la función query(), junto
        a las funciones de ordenamiento (como orderBy) o filtrado
        (como where) que queramos.
    */
    const chatQuery = query(chatRef, orderBy('created_at'));

    /*
        Para obtener un snapshot cada vez que los datos cambien,
        la función getDocs no nos sirve. En su lugar, vamos a optar
        por la función onSnapshot().
        Esta función recibe 2 parámetros:
        1. La referencia a la collection o query.
        2. Un callback con lo que queremos ejecutar en cada cambio
            de los documentos. Este callback recibe como parámetro el
            snapshot.
        Retorna una función de "Unsubscribe".
    */
    return onSnapshot(chatQuery, snapshot => {
        const messages = snapshot.docs.map(doc => {
            return {
                // Para obtener el id del documento, usamos su propiedad id.
                id: doc.id,
                // Para obtener los datos del documento tenemos que llamar a
                // su método data().
                user_id: doc.data().user_id,
                email: doc.data().email,
                text: doc.data().text,
                // ?. Optional Chain Operator
                // Este operador indica que solo se debe encadenar la
                // siguiente propiedad si la anterior no es null o undefined.
                created_at: doc.data().created_at?.toDate(),
            }
        });
        
        // Ejecutamos el callback que recibimos como argumento y
        // le pasamos los mensajes.
        callback(messages);
    });
}