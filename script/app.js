document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('guardarAudio').addEventListener('click', guardarAudio);
  cerrarModal();
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

        function mostrarPagina() {
            var start = currentPageIndex * imagesPerPage;
            var end = start + imagesPerPage;
            var paginatedUrls = imageUrls.slice(start, end);
            mostrarResultados(paginatedUrls);
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
           

            var apiKey = "LZFzflDoYZoDme1NO9ijENkROxA1XNuc9ciL9CtPRHmPbEQoX2ULJ2zGmMIq";
            /*var apiKey = "cdI9D7Fv8ZV9KtjW5qh8k3aAcZTPMjOdWQv5dEzvzVi3n4w1UckF6NN1VH8c";*/
            

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

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
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
    mediaRecorder.pause();
    document.getElementById('pauseRecord').disabled = true;
    document.getElementById('startRecord').disabled = false;
    document.getElementById('stopRecord').disabled = false;
}

function stopRecording() {
    mediaRecorder.stop();
    document.getElementById('stopRecord').disabled = true;
    document.getElementById('pauseRecord').disabled = true;
    document.getElementById('startRecord').disabled = false;
    document.getElementById('volverGrabar').disabled = false;
}

function playAudio() {
    document.getElementById('audioPlayer').play();
}

function guardarAudio() {
  // Lógica para guardar el audio en el localStorage
  const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
  const audioUrl = URL.createObjectURL(audioBlob);


  cerrarModal();  // Cerrar el modal principal
  // Guardar en el localStorage
  localStorage.setItem('audioURL', audioUrl);



  // Esperar un breve intervalo antes de cerrar el modal de voz y mostrar el popup
  setTimeout(function () {
     abrirModalVoz();   // Mostrar el popup de ¡Voz agregada con éxito!
  }, 200); // Puedes ajustar este valor si es necesario
  
}

function volverAGrabar() {
    // Lógica para volver a grabar
    audioChunks = [];
    document.getElementById('audioPlayer').src = "";
    document.getElementById('playRecord').disabled = true;
    document.getElementById('volverGrabar').disabled = true;
}
    

