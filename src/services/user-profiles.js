import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * 
 * @param {string} id 
 * @returns {Promise<{id: string, email: string, displayName: string|null, bio: string|null, career: string|null, photoURL: string|null}>}
 */
export async function getUserProfileById(id) {
    const userRef = doc(db, `user-profiles/${id}`);

    const userDoc = await getDoc(userRef);

    return {
        id: userDoc.id,
        ...userDoc.data(),
        // email: userDoc.data().email,
        // displayName: userDoc.data().displayName,
        // bio: userDoc.data().bio,
        // career: userDoc.data().career,
    }
}

/**
 * 
 * @param {string} id 
 * @param {{displayName: string, bio: string, career: string, photoURL: string}} data 
 */
export async function createUserProfile(id, data) {
    const userRef = doc(db, `user-profiles/${id}`);
    await setDoc(userRef, data);
}

/**
 * 
 * @param {string} id 
 * @param {{displayName: string, bio: string, career: string, photoURL: string}} data
 */
export async function editUserProfile(id, data) {
    // Acá queremos actualizar un documento específico de la collection
    // "user-profiles".
    // Para trabajar con un documento específico, tenemos que obtener la
    // referencia a dicho documento. Esto lo hacemos con la función doc().
    const userRef = doc(db, `user-profiles/${id}`);

    // Usamos la función updateDoc() para actualizar el contenido del
    // documento.
    await updateDoc(userRef, {
        ...data
    });
}