/**
* 
* @param {Date|null} date 
* @returns {String} La fecha en formato de "DD/MM/AAAA hh:mm".
*/
export function formatDate(date) {
    if(!date) return null;

    // Vamos a utilizar la clase Intl.DateTimeFormat para darle
    // formato a la fecha.
    const formatter = new Intl.DateTimeFormat('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false,
    });
    return formatter.format(date).replace(',', '');
}