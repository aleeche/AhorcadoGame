

let palabraSecreta = "";// palabra a adivinar
let palabraMostrada = [];// palabra con letras adivinadas y guiones
const MAX_INTENTOS = 6;// intentos máximos
let intentos;// intentos restantes
let letrasUsadas = [];// letras ya intentadas
let totalIntentos = 0;// contador de intentos totales


/*Se guardan referencias a los elementos HTML para manipularlos desde JavaScript: 
canvas, palabra, teclado, letras usadas, input, botones y mensajes.*/
const canvas = document.getElementById("personCanvas");
const ctx = canvas.getContext("2d");

const wordContainer = document.getElementById("wordContainer");
const keyboardDiv = document.getElementById("keyboard");
const usedLettersP = document.getElementById("usedLetters");
const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const restartButton = document.getElementById("restartButton");
const messageDiv = document.getElementById("message");


const sonidoVictoria = new Audio("../audio/victoria.mp3");
const sonidoDerrota = new Audio("../audio/derrota.mp3");
const sonidoFallo = new Audio("../audio/error.mp3");
// ---------------------- FUNCIONES ------------------------------
// Reproducir música de fondo
function PlayAudioFondo(){
  document.getElementById("audio").volume = 0.4;
  document.getElementById("audio").play();
}

document.addEventListener('keydown', (e) => {//Escucha los eventos de teclado. (e) es el objeto del evento (un KeyboardEvent) 
        document.getElementById("audio").volume = 0.4;
        document.getElementById("audio").play();
});

function createCelebration() {
  const numParticles = 200;  
  for (let i = 0; i < numParticles; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#d6a7ffff','#ffe3a7ff'][Math.floor(Math.random() * 6)];
            confetti.style.zIndex = '1000';
            confetti.style.borderRadius = '50%';
            confetti.style.animation = 'float 3s linear forwards';
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 50);
    }
}
/*Se generan 200 confetis.
Cada uno aparece en una posición horizontal aleatoria.
Cada confeti cae desde arriba con un efecto animado.
Cada confeti se elimina automáticamente después de 3 segundos.
El efecto crea una lluvia colorida de partículas, muy visual y atractivo para celebraciones.*/


// Iniciar nuevo juego
function nuevoJuego() {
  palabraSecreta = palabras[Math.floor(Math.random() * palabras.length)];
  palabraMostrada = Array(palabraSecreta.length).fill("_");
  intentos = MAX_INTENTOS;
  letrasUsadas = [];
  messageDiv.textContent = "";
  actualizarVista();
  limpiarCanvas();
  generarTeclado();
  totalIntentos = 0;

  /*restartButton.style.display = "inline-block";*/
}
/*Elige una palabra aleatoria del array palabras.
Inicializa palabraMostrada con guiones.
Resetea intentos, letras usadas y mensaje.
Actualiza la vista (actualizarVista), limpia y dibuja la base del canvas (limpiarCanvas) y genera el teclado virtual (generarTeclado).
Reinicia totalIntentos. */




// Actualizar palabra y letras usadas
function actualizarVista() {
  wordContainer.textContent = palabraMostrada.join(" ");
  usedLettersP.textContent = letrasUsadas.join(", ") || "Ninguna";
}
/*Muestra la palabra con guiones o letras acertadas.
Muestra las letras usadas, o "Ninguna" si aún no se ha usado ninguna. */



// Crear teclado virtual
function generarTeclado() {
  keyboardDiv.innerHTML = "";
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let letra of letras) {
    const btn = document.createElement("button");
    btn.textContent = letra;
    btn.addEventListener("click", () => manejarLetra(letra.toLowerCase(), btn));
    keyboardDiv.appendChild(btn);
  }
}
/*Borra teclado previo (innerHTML = "").
Crea botones para cada letra.
Asocia evento click que llama a manejarLetra.
Añade cada botón al keyboardDiv. */





// Manejar letra seleccionada
function manejarLetra(letra, btn) {
  totalIntentos++;
  if (letrasUsadas.includes(letra) || intentos <= 0) return;

  letrasUsadas.push(letra);
  btn.disabled = true;

  if (palabraSecreta.includes(letra)) {
    for (let i = 0; i < palabraSecreta.length; i++) {
      if (palabraSecreta[i] === letra) palabraMostrada[i] = letra;
    }
  } else {
    intentos--;
    dibujarAhorcado();
    sonidoFallo.play();
  }

  actualizarVista();
  verificarEstado();
}
/*Incrementa total de intentos.
Evita letras repetidas o continuar si ya se acabaron los intentos.
Si la letra está en la palabra: se actualiza palabraMostrada.
Si no está: se resta un intento y se dibuja la siguiente parte del ahorcado (dibujarAhorcado).
Luego actualiza la vista y verifica si se ganó o perdió (verificarEstado).*/



// Verificar victoria/derrota
function verificarEstado() {
  if (!palabraMostrada.includes("_")) {
    messageDiv.textContent = `¡Ganaste! La palabra era: ${palabraSecreta}. Te tomó ${totalIntentos} intentos.`;
    restartButton.style.display = "inline-block"; // Mostrar reinicio
    desactivarTeclado();
    sonidoVictoria.play();
    createCelebration();
  } else if (intentos <= 0) {
    palabraMostrada = palabraSecreta.split("");
    actualizarVista();

    messageDiv.textContent = `¡Perdiste! La palabra era: ${palabraSecreta}`;
    restartButton.style.display = "inline-block"; // Mostrar reinicio
    sonidoDerrota.play();
    desactivarTeclado();
  }

}
/*Si ya no quedan guiones -> jugador ganó.
Si se acabaron los intentos -> jugador perdió y se revela la palabra.
En ambos casos, se muestra el botón de reinicio y se desactiva el teclado. */




// Desactivar teclado cuando termina el juego
function desactivarTeclado() {
  const botones = keyboardDiv.querySelectorAll("button");
  botones.forEach(b => b.disabled = true);

  const guessBtn = document.getElementById("guessButton");
  guessBtn.disabled = true;
  guessBtn.style.opacity = 0.5;
  guessBtn.style.opacity = 0.5;
  guessBtn.style.cursor = "not-allowed";

  const guessInput = document.getElementById("guessInput");
  guessInput.disabled = true;
  guessInput.style.opacity = 0.5;

}
/* Deshabilita todos los botones del teclado virtual.
Deshabilita input y botón de probar palabra completa, y ajusta estilo para indicar que no están activos.*/



// Manejar palabra completa
guessButton.addEventListener("click", () => {
  const intento = guessInput.value.toLowerCase().trim();
  if (!intento) return;

  if (intento === palabraSecreta) {
    palabraMostrada = palabraSecreta.split("");
    actualizarVista();
    messageDiv.textContent = `¡Ganaste adivinando la palabra completa!`;
    restartButton.style.display = "inline-block";
    sonidoVictoria.play();
    createCelebration();
    desactivarTeclado();
  } else {
    intentos = 0;
    palabraMostrada = palabraSecreta.split("");
    dibujarAhorcado();
    actualizarVista();
    messageDiv.textContent = `¡Fallaste! La palabra era: ${palabraSecreta}`;
    restartButton.style.display = "inline-block"; // Mostrar reinicio
    desactivarTeclado();
    sonidoDerrota.play();
    desactivarTeclado();
  }
  guessInput.value = "";
});
/*Permite al jugador arriesgar adivinando toda la palabra.
Si acierta -> victoria instantánea.
Si falla -> pérdida instantánea y se dibuja el ahorcado completo. */



// Botón reiniciar
function reiniciar() {
  restartButton.style.display = "none";
  nuevoJuego();
  guessInput.value = ""; // Limpiar input

  const guessBtns = document.getElementById("guessButton");
  guessBtns.disabled = false;
  guessBtns.style.opacity = 1; // quitar opacidad
  guessBtns.style.cursor = "pointer"; // volver cursor normal

  const guessInputs = document.getElementById("guessInput");
  guessInputs.disabled = false;
  guessInputs.style.opacity = 1;
}
restartButton.addEventListener("click", reiniciar);
/*Oculta botón de reinicio.
Llama a nuevoJuego() para iniciar de nuevo.
Reactiva input y botón de palabra completa. */

// ------------------------------ CANVAS ------------------------------

function dibujarBase() {
  // Base
  ctx.moveTo(20, 280);
  ctx.lineTo(280, 280);
  ctx.stroke();

  // Poste vertical
  ctx.moveTo(50, 280);
  ctx.lineTo(50, 50);
  ctx.stroke();

  // Poste horizontal
  ctx.moveTo(50, 50);
  ctx.lineTo(200, 50);
  ctx.stroke();

  // Cuerda
  ctx.moveTo(200, 50);
  ctx.lineTo(200, 80);
  ctx.stroke();
}

function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  dibujarBase(); // Dibuja siempre la base y cuerda
}
function dibujarAhorcado() {


  const partes = MAX_INTENTOS - intentos;
/* Calcula cuántas partes del ahorcado deben dibujarse según los intentos fallidos.*/



  // Dibujar todas las partes hasta la actual
  for (let i = 1; i <= partes; i++) {//Este ciclo permite dibujar de forma acumulativa todas las partes que corresponden a los errores hasta ahora.
    switch (i) {//Para cada valor de i, dibuja la parte específica:
      case 1: // Cabeza
        ctx.beginPath();
        ctx.arc(200, 100, 20, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 2: // Cuerpo
        ctx.moveTo(200, 120);
        ctx.lineTo(200, 200);
        ctx.stroke();
        break;
      case 3: // Brazo izquierdo
        ctx.moveTo(200, 150);
        ctx.lineTo(170, 180);
        ctx.stroke();
        break;
      case 4: // Brazo derecho
        ctx.moveTo(200, 150);
        ctx.lineTo(230, 180);
        ctx.stroke();
        break;
      case 5: // Pierna izquierda
        ctx.moveTo(200, 200);
        ctx.lineTo(170, 240);
        ctx.stroke();
        break;
      case 6: // Pierna derecha
        ctx.moveTo(200, 200);
        ctx.lineTo(230, 240);
        ctx.stroke();
        break;
    }
  }
}
/*El ciclo for permite dibujar todas las partes acumuladas hasta el momento, no solo la última.
partes controla cuántas se deben dibujar según errores.
switch dibuja la parte específica de cada número. */

// ------------------------------ INICIO ------------------------------
limpiarCanvas(); // Dibuja base al iniciar
nuevoJuego();
/*Al cargar la página: limpia canvas y genera un nuevo juego.*/
