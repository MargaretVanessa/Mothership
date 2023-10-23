/* Cuando hago CLICK .button, .nav TOGGLE 'activo' */
const button = document.querySelector('.button')
const nav    = document.querySelector('.nav')

button.addEventListener('click',()=>{
    nav.classList.toggle('activo')
})

document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('miFormulario');

    formulario.addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtiene los valores del formulario
        const queQuieresVer = document.getElementById('queQuieresVer').value;
        const opciones = document.getElementById('opciones').value;

        // Realiza validaciones, por ejemplo, si el campo de texto está vacío
        if (!queQuieresVer) {
            alert('Debes ingresar una Descripción');
            return;
        }

        // Validación adicional para queQuieresVer
        const caracteresPermitidos = /^[a-zA-Z0-9,.;\-"\s]+$/; // Caracteres permitidos

        if (!caracteresPermitidos.test(queQuieresVer)) {
            alert('La descripción contiene caracteres no permitidos');
            return;
        }

        // Validación adicional para opciones
        if (opciones === 'Estilo' || opciones.trim() === '') {
            alert('Selecciona un Estilo válido');
            return;
        }

        // Crea un objeto JSON con los datos
        const imagenData = {
            descripcion: queQuieresVer,
            estilo: opciones
        };

        // Puedes realizar otras operaciones aquí, como enviar este objeto a una API
        // o simplemente guardarlos en una variable para futuros usos.

        console.log(imagenData); // Muestra el objeto JSON en la consola
    });
});