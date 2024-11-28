<script>
import BaseHeading1 from '../components/BaseHeading1.vue';
import { editMyProfilePhoto } from '../services/auth';

export default {
    name: 'MyProfileEditPhoto',
    components: { BaseHeading1 },
    data() {
        return {
            editData: {
                photo: null,
                photoPreview: null,
            },
            saving: false,
        }
    },
    methods: {
        async handleSubmit() {
            this.saving = true;

            try {
                await editMyProfilePhoto(this.editData.photo);
            } catch (error) {
                // TODO...
            }

            this.saving = false;
        },

        // Nuestro objetivo con este método es capurar el valor del campo
        // file y mostrar una previsualización de la imagen seleccionada.
        // Como v-model no funciona, para poder obtener el archivo 
        // seleccionado necesitamos acceder al elemento del DOM del campo.
        // Si bien, en teoría, uno podría buscar el campo por su id o por
        // una clase usando querySelector, en la práctica esto no es viable.
        // Vue puede, al re-renderizar el componente, destruir un elemento 
        // y recrearlo, con lo que perderiamos la referencia previamente 
        // obtenida.
        // La forma preferida de obtener el elemento del DOM del campo es 
        // a través de la propiedad "target" del objeto Event.
        handleFileSelection(ev) {
            // Con ev.target podemos acceder al campo file.
            // Los inputs de tipo file tienen una propiedad llamada
            // "files".
            // Esta propiedad contiene un objeto de tipo FileList. En
            // esencia, es un array de objetos File.
            // Cada objeto File representa, claramente, un archivo.
            // Como nuestro campo no tiene el atributo "multiple", solo
            // se puede elegir un archivo. Sabiendo esto, podemos 
            // hard-codear la posición 0 del array.
            this.editData.photo = ev.target.files[0];

            // Ahora vamos a leer el contenido del archivo para poder
            // mostrar la previsualización de la imagen.
            // Para leer el contenido de un archivo File podemos usar la
            // clase de JS FileReader.
            const reader = new FileReader();

            // A través de FileReader vamos a poder configurar qué
            // queremos hacer cuando se haya leído un archivo, y vamos
            // a poder indicar en qué formato queremos obtener el 
            // contenido.
            reader.addEventListener('load', () => {
                // Una vez que el archivo terminó de leerse, vamos a poder
                // acceder al contenido a través de la propiedad "result"
                // del reader.
                this.editData.photoPreview = reader.result;
            });

            // Pedimos leer el archivo con el formato de "data URL".
            // Las "data URLs" son URLs que usan el protocolo "data:" y
            // contienen el contenido del archivo cifrado en algún string,
            // típicamente en base64.
            // La gracia que tienen es que como son URLs, se pueden usar
            // en cualquier contexto que espera recibir una URL, como
            // por ejemplo, el "src" de una <img>, el contenido de la
            // función url() de CSS, etc.
            reader.readAsDataURL(this.editData.photo);
        }
    }
}
</script>

<template>
    <BaseHeading1>Editar mi Foto de Perfil</BaseHeading1>

    <div class="flex gap-4 items-start">
        <form
            action="#"
            class="w-1/2"
            @submit.prevent="handleSubmit"
        >
            <div class="mb-4">
                <label for="photo" class="block mb-2">Nueva Foto</label>
                <input
                    type="file"
                    id="photo"
                    class="w-full p-2 border border-gray-400 rounded"
                    @change="handleFileSelection"
                >
            </div>
            <button
                type="submit"
                class="py-2 px-4 rounded bg-blue-700 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900 text-white"
            >
                {{ !saving ? 'Actualizar Mi Foto' : 'Grabando cambios...' }}
            </button>
        </form>
        <div class="w-1/2">
            <h2>Previsualización</h2>
            <img
                v-if="editData.photoPreview"
                :src="editData.photoPreview"
                alt=""
            >
        </div>
    </div>
</template>