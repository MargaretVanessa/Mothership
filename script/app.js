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


// Función query
async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
            headers: { Authorization: "Bearer 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" },
            method: "POST",
            body: JSON.stringify(data),
        }
        );
        const result = await response.blob();
        return result;
    }
    
// Evento click para el botón "Crear imagen"
const crearImagenBtn = document.getElementById('crearImagenBtn');
crearImagenBtn.addEventListener('click', async () => {
    const queQuieresVer = document.getElementById('queQuieresVer').value;
    const opciones = document.getElementById('opciones').value;

    if (!queQuieresVer) {
        alert('Debes ingresar una descripción');
        return;
    }

    if (opciones === 'Estilo') {
        alert('Selecciona una opción válida');
        return;
    }

    const imagenData = {
        "inputs": `Descripción: ${queQuieresVer}, Opción: ${opciones}`
    };

    try {
        const response = await query(imagenData);

        // Comprueba si la respuesta es una imagen
        if (response instanceof Blob) {
            const imageUrl = URL.createObjectURL(response);

            // Crea o actualiza un elemento <img> en el DOM
            const imagenElement = document.getElementById('imagen');
            if (imagenElement) {
                imagenElement.src = imageUrl;
                imagenElement.alt = 'Imagen generada';
            } else {
                const nuevaImagen = document.createElement('img');
                nuevaImagen.id = 'imagen';
                nuevaImagen.src = imageUrl;
                nuevaImagen.alt = 'Imagen generada';
                document.querySelector('.contenido').appendChild(nuevaImagen);
            }
        } else {
            console.error('La respuesta no es una imagen válida.');
        }
    } catch (error) {
        console.error('Error al obtener la imagen:', error);
    }
});