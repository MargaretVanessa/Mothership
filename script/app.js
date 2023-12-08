document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('guardarAudio').addEventListener('click', guardarAudio);
  document.getElementById('guardarAudio').removeEventListener('click', guardarAudio);
  cerrarModal();
  console.log("Evento de clic en guardarAudio registrado.");

   // Verificar si hay imágenes y audio almacenados en el localStorage
   if (hayImagenesAlmacenadas() && hayAudioAlmacenado()) {
    mostrarBotonContinuar();
  }
});
 
  var generatedImagesContainer = document.getElementById('resultado')
  generatedImagesContainer.style.display = "none"

  var generatedPaginator = document.getElementById('pagination')
  generatedPaginator.style.display = "none"

 // Función para abrir el modal
 function abrirModal() {
    console.log('Abriendo modal');
    var modal = document.getElementById('miModal');
    if (modal !== null) {
      modal.style.display = 'flex';
    }
  }

  // Función para cerrar el modal
  function cerrarModal() {
    console.log('Cerrando modal');
    var modal = document.getElementById('miModal');
    if (modal !== null) {
      modal.style.display = 'none';
    }
  }

  
 // Función para abrir el modalVoz
 function abrirModalVoz() {
  console.log('Abriendo modal');
  var modal = document.getElementById('miModalVoz');
    modal.style.display = 'flex';
}

function cerrarModalVoz() {
  console.log('Cerrando modal');
  var modal = document.getElementById('miModalVoz');
    modal.style.display = 'none';
}

/* Cuando hago CLICK .button, .nav TOGGLE 'activo' */
const button = document.querySelector('.button')
const nav    = document.querySelector('.nav')


button.addEventListener('click',()=>{
    nav.classList.toggle('activo')
})

/*IMAGEN API*/

        var imageUrls = [];
        var currentPageIndex = 0;
        var imagesPerPage = 1; // Cambiado a 1 para mostrar solo una imagen por página

        // Intenta cargar las imágenes desde el localStorage al cargar la página
        cargarImagenesDesdeLocalStorage();

        function mostrarPagina() {
            var start = currentPageIndex * imagesPerPage;
            var end = start + imagesPerPage;
            var paginatedUrls = imageUrls.slice(start, end);
            mostrarResultados(paginatedUrls);

            // Almacena las URLs de las imágenes en el localStorage
            guardarImagenesEnLocalStorage(imageUrls);
        }

        function guardarImagenesEnLocalStorage(urls) {
          var imagenesJson = JSON.stringify(urls);
          localStorage.setItem('imagenes', imagenesJson);
      }
      
      function cargarImagenesDesdeLocalStorage() {
          var imagenesJson = localStorage.getItem('imagenes');
          if (imagenesJson) {
              imageUrls = JSON.parse(imagenesJson);
              mostrarPagina();
          }
      }

        function generarPaginacion() {
        var totalPages = Math.ceil(imageUrls.length / imagesPerPage);
        var paginationDiv = document.getElementById('pagination');
        paginationDiv.innerHTML = '';

            if (totalPages > 1) {
                for (var i = 0; i < totalPages; i++) {
                    var button = document.createElement('button');
                    button.textContent = i + 1;
                    button.addEventListener('click', function () {
                        currentPageIndex = parseInt(this.textContent) - 1;
                        mostrarPagina();
                    });
                    paginationDiv.appendChild(button);
                }
            }
        }

        function mostrarResultados(urls) {
            var resultadoDiv = document.getElementById('resultado');
            resultadoDiv.innerHTML = '';

            urls.forEach(function(url, index) {
                var imagen = document.createElement('img');
                imagen.src = url;
                imagen.alt = 'Imagen ' + (index + 1);
                resultadoDiv.appendChild(imagen);
            });

            // Mostrar paginación después de mostrar la primera imagen
            generarPaginacion();
        }

        function generarImagenes() {
            generatedImagesContainer.style.display = "block"
            generatedPaginator.style.display = "block"

             // Mostrar el popup
             var popup = document.getElementById('popup');
             popup.style.display = 'block';

            const botongenerarimagenes = document.getElementById("generate-btn")
            botongenerarimagenes.style.display = "none"
            const tituloTexto = document.getElementById("titulo-imagen")
            tituloTexto.style.display = "none"
            var texto = document.getElementById('texto').value;
           

            /*var apiKey = "81sKF79HmiSaQMvYhy49a9jW1x5KXeaF1gRlesXoxz8Y5Nh4rAi6BMVhPMWF";
            var apiKey = "cdI9D7Fv8ZV9KtjW5qh8k3aAcZTPMjOdWQv5dEzvzVi3n4w1UckF6NN1VH8c";*/
            

            var apiUrl = "https://stablediffusionapi.com/api/v3/text2img";
            var params = {
                key: apiKey,
                prompt: texto,
                negative_prompt: null,
                width: "400",
                height: "400",
                samples: "3",
                num_outputs: 3,
                multi_lingual: "yes",
            };

            fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(params),
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                if (data.status === "processing") {
                  // Iniciar la actualización de la barra de progreso
                  actualizarBarraProgreso(data.eta);
          
                  // Esperar hasta que la API haya completado el procesamiento
                  setTimeout(function () {
                    fetch(data.fetch_result, { method: 'POST' })
                      .then(response => response.json())
                      .then(resultData => {
                        if (resultData && resultData.status === "success" && resultData.output && resultData.output.length > 0) {
                          // Detener la actualización de la barra de progreso
                          detenerBarraProgreso();
          
                          // Ocultar el popup después de que la API haya respondido
                          popup.style.display = 'none';
          
                          imageUrls = resultData.output;
                          mostrarPagina();
                        } else {
                          console.error('Respuesta de la API no tiene la propiedad "output" o "fetch_result":', data);
                          mostrarResultados([]);
                        }
                      })
                      .catch(handleError);
                  }, data.eta * 1000);
                } else if (data.status === "success" && data.output && data.output.length > 0) {
                  // Detener la actualización de la barra de progreso
                  detenerBarraProgreso();
          
                  // Ocultar el popup después de que la API haya respondido
                  popup.style.display = 'none';
          
                  imageUrls = data.output;
                  mostrarPagina();
                } else {
                  console.error('Respuesta de la API no tiene la propiedad "output" o "fetch_result":', data);
                  mostrarResultados([]);
                }
              })
              .catch(handleError);
          }

          function actualizarBarraProgreso(eta) {
            var progressBar = document.getElementById('progress');
            var startTime = Date.now();
            var duration = eta * 1000; // Convertir el tiempo estimado a milisegundos
          
            function updateProgress() {
              var currentTime = Date.now();
              var elapsedTime = currentTime - startTime;
              var progress = (elapsedTime / duration) * 100;
          
              if (progress <= 100) {
                progressBar.style.width = progress + '%';
                requestAnimationFrame(updateProgress);
              }
            }
          
            updateProgress();
          }
      
      function detenerBarraProgreso() {
        var progressBar = document.getElementById('progress');
        progressBar.style.width = '100%';
      }
      
      function handleError(error) {
        console.error('Error:', error);
        var resultadoDiv = document.getElementById('resultado');
        resultadoDiv.innerHTML = '<p style="color: red;">Error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.</p>';
      }
        
/*GRABAR AUDIO*/

let mediaRecorder;
let audioChunks = [];
let grabaciones = [];
let audioGrabado = false;

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            audioGrabado = true;
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                grabaciones.push([...audioChunks]); // Almacenar una copia de los audioChunks
                audioChunks = [];

                const audioBlob = new Blob(grabaciones.flat(), { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                document.getElementById('audioPlayer').src = audioUrl;
                document.getElementById('playRecord').disabled = false;
                document.getElementById('volverGrabar').disabled = false;
            };

            mediaRecorder.start();
            document.getElementById('startRecord').disabled = true;
            document.getElementById('pauseRecord').disabled = false;
            document.getElementById('stopRecord').disabled = false;
        })
        .catch((error) => console.error('Error al acceder al micrófono:', error));
}

function pauseRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        document.getElementById('pauseRecord').disabled = true;
        document.getElementById('startRecord').disabled = false;
        document.getElementById('stopRecord').disabled = false;
    }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
  }

  // Si hay grabaciones, reproducir la última
  if (grabaciones.length > 0) {
      const audioBlob = new Blob(grabaciones.flat(), { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      document.getElementById('audioPlayer').src = audioUrl;
      document.getElementById('playRecord').disabled = false;
  }

  document.getElementById('stopRecord').disabled = true;
  document.getElementById('pauseRecord').disabled = true;
  document.getElementById('startRecord').disabled = false;
  document.getElementById('volverGrabar').disabled = false;
}

function playAudio() {
    document.getElementById('audioPlayer').play();
}

function guardarAudio() {
    console.log("Guardando audio...");
    if (audioGrabado) {
        const audioBlob = new Blob(grabaciones.flat(), { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);

        cerrarModal();
        localStorage.setItem('audioURL', audioUrl);

        reiniciarMenuGrabacion();
        audioGrabado = false;

        setTimeout(function () {
            abrirModalVoz();
        }, 200);
    } else {
        alert("Para guardar el audio, primero debes grabar.");
    }
}

function volverAGrabar() {
  // Detener la grabación actual si está en curso
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
  }

  // Limpiar las grabaciones anteriores y comenzar una nueva sesión
  grabaciones = [];
  audioChunks = [];
  document.getElementById('audioPlayer').src = "";
  document.getElementById('playRecord').disabled = true;
  document.getElementById('volverGrabar').disabled = true;

  // Iniciar una nueva sesión de grabación
  startRecording();
}

function reiniciarMenuGrabacion() {
    grabaciones = []; // Restablecer las sesiones
    document.getElementById('audioPlayer').src = "";
    document.getElementById('playRecord').disabled = true;
    document.getElementById('volverGrabar').disabled = true;
    console.log('Menú de grabación restablecido');
}

function mostrarBotonContinuar() {
  var botonContinuar = document.getElementById('botonContinuar');
  if (botonContinuar) {
      botonContinuar.style.display = 'block';
  }
}

function hayImagenesAlmacenadas() {
  var imagenesJson = localStorage.getItem('imagenes');
  return imagenesJson !== null;
}

function hayAudioAlmacenado() {
  var audioUrl = localStorage.getItem('audioURL');
  return audioUrl !== null;
}

