import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Sube un archivo al path indicado.
 * 
 * @param {string} path 
 * @param {File} file 
 */
export async function uploadFile(path, file) {
    // Al igual que sucede con Firestore, Storage tmabién requiere que 
    // definamos las referencias de los recursos con los que queremos
    // interactuar.
    // En este caso, vamos a usar la función ref() de Storage (no confundir
    // con la función ref() de Vue);
    const fileRef = ref(storage, path);

    // uploadBytes permite subir un archivo en formato File o Blob.
    await uploadBytes(fileRef, file);
}

/**
 * Retorna la URL absoluta desde donde descargar el archivo.
 * 
 * @param {string} path 
 * @returns {Promise<string>}
 */
export async function getFileURL(path) {
    const fileRef = ref(storage, path);

    return await getDownloadURL(fileRef);
}