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

//grabar audio//
document.addEventListener('DOMContentLoaded', (event) => {
    const botonesAudio = document.querySelectorAll('.botonaudio');
    let mediaRecorder;
    let audioChunks = [];
    let audioElement = new Audio();

    // Función para iniciar la grabación
    function startRecording() {
        audioChunks = [];
        const mediaConstraints = { audio: true };

        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(function (stream) {
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = function (event) {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = function () {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);

                    // Establecer la fuente del elemento de audio
                    audioElement.src = audioUrl;

                    console.log('Grabación completada:', audioUrl);

                    // Aquí puedes hacer lo que quieras con el audioBlob o audioUrl
                };

                mediaRecorder.start();
            })
            .catch(function (error) {
                console.log('Error al obtener permisos de audio:', error);
            });
    }

    // Función para detener la grabación
    function stopRecording() {
        if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    }

    // Maneja el evento de clic en los botones de audio
    botonesAudio.forEach((boton) => {
        boton.addEventListener('click', () => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                // Detener la grabación si ya está en curso
                stopRecording();
            } else {
                // Iniciar la grabación si no está en curso
                startRecording();
            }
        });
    });

    // Reproducir el audio grabado
    document.getElementById('reproducirAudio').addEventListener('click', () => {
        if (audioElement.src) {
            audioElement.play();
        }
    });
});

