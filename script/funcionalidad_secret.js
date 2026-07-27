//const palabras = ["gato","casa","sol","flor","luz","perro","pan"];
// El arreglo "palabras" se define en el <head> de nivel_secreto.html.

// ---------------------- VARIABLES DE ESTADO ------------------------------
let palabraSecreta = "";   // palabra a adivinar en la partida actual
let palabraMostrada = [];  // palabra en pantalla con letras acertadas y guiones
const MAX_INTENTOS = 6;    // intentos máximos (número de partes del muñeco)
let intentos;              // intentos restantes en la partida actual
let letrasUsadas = [];     // letras que el jugador ya ha intentado
let totalIntentos = 0;     // contador de intentos totales (aciertos + fallos)


/* Referencias a los elementos HTML que se manipulan desde JavaScript:
   canvas, palabra, teclado, letras usadas, input, botones y mensajes. */
const canvas = document.getElementById("personCanvas");
const ctx = canvas.getContext("2d");

const wordContainer = document.getElementById("wordContainer");
const keyboardDiv = document.getElementById("keyboard");
const usedLettersP = document.getElementById("usedLetters");
const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const restartButton = document.getElementById("restartButton");
const messageDiv = document.getElementById("message");

// Sonidos propios del nivel secreto (derrota y fallo con variantes distintas).
const sonidoDerrota = new Audio("../audio/derrota2.mp3");
const sonidoFallo = new Audio("../audio/error2.mp3");
// =------------------------------ FUNCIONES ------------------------------

// Reproducir música de fondo (se llama al hacer clic en el body).
function PlayAudioFondo() {
    document.getElementById("audio").play();
}

// Escucha los eventos de teclado. (e) es el objeto del evento (un KeyboardEvent).
// Cualquier tecla presionada inicia/continúa la música de fondo.
document.addEventListener('keydown', (e) => {
    document.getElementById("audio").volume = 0.4;
    document.getElementById("audio").play();
});

/* Efecto de "celebración" del nivel secreto.
   A diferencia del juego normal, aquí no hay confeti: se muestra una imagen
   a pantalla completa junto al sonido de derrota, creando un efecto de susto. */
function createCelebration() {
    sonidoDerrota.play();
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundImage = "url('../img/celebration.png')";
    overlay.style.backgroundSize = 'cover';   // que cubra toda la pantalla
    overlay.style.backgroundPosition = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '0';

    // Agregar al body
    document.body.appendChild(overlay);

    // Activar la transición de opacidad para que aparezca gradualmente.
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 50);
    // Desvanecer y remover la imagen después de unos segundos.
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 1000);
    }, 2000); //2 segundos
}


// Iniciar nuevo juego
function nuevoJuego() {
    palabraSecreta = palabras[Math.floor(Math.random() * palabras.length)]; // palabra aleatoria
    palabraMostrada = Array(palabraSecreta.length).fill("_");                // todo oculto con guiones
    intentos = MAX_INTENTOS;   // restablece los intentos disponibles
    letrasUsadas = [];         // limpia las letras usadas
    messageDiv.textContent = ""; // limpia el mensaje anterior
    actualizarVista();         // refresca palabra y letras usadas
    limpiarCanvas();           // dibuja el muñeco completo (estado inicial del nivel secreto)
    generarTeclado();          // genera el teclado virtual
    totalIntentos = 0;         // reinicia el contador total

    /*restartButton.style.display = "inline-block";*/
}

// Actualizar palabra mostrada y letras usadas en pantalla.
function actualizarVista() {
    wordContainer.textContent = palabraMostrada.join(" ");            // palabra con guiones/letras
    usedLettersP.textContent = letrasUsadas.join(", ") || "Ninguna";  // letras usadas o "Ninguna"
}

// Crear teclado virtual con las letras A–Z.
function generarTeclado() {
    keyboardDiv.innerHTML = ""; // borra el teclado previo
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let letra of letras) {
        const btn = document.createElement("button");       // un botón por letra
        btn.textContent = letra;
        btn.addEventListener("click", () => manejarLetra(letra.toLowerCase(), btn)); // click -> manejarLetra
        keyboardDiv.appendChild(btn);
    }
}

// Manejar la letra seleccionada por el jugador.
function manejarLetra(letra, btn) {
    totalIntentos++; // cuenta cada intento (acierto o fallo)
    if (letrasUsadas.includes(letra) || intentos <= 0) return; // ignora repetidas o juego terminado

    letrasUsadas.push(letra); // registra la letra
    btn.disabled = true;      // desactiva su botón

    if (palabraSecreta.includes(letra)) {
        // Acierto: revela la letra en todas sus posiciones.
        for (let i = 0; i < palabraSecreta.length; i++) {
            if (palabraSecreta[i] === letra) palabraMostrada[i] = letra;
        }
    } else {
        // Fallo: descuenta un intento y borra una parte del muñeco.
        intentos--;
        dibujarAhorcado();

    }

    actualizarVista();  // refresca la vista
    verificarEstado();  // comprueba si ganó o perdió
}

// Verificar victoria o derrota tras cada jugada.
function verificarEstado() {
    if (!palabraMostrada.includes("_")) {
        // No quedan guiones -> el jugador ganó.
        messageDiv.textContent = `¡Ganaste! La palabra era: ${palabraSecreta}. Te tomó ${totalIntentos} intentos.`;
        restartButton.style.display = "inline-block"; // Mostrar reinicio
        desactivarTeclado();
    } else if (intentos <= 0) {
        // Se agotaron los intentos -> el jugador perdió y se revela la palabra.
        palabraMostrada = palabraSecreta.split("");
        actualizarVista();

        messageDiv.textContent = `¡Perdiste! La palabra era: ${palabraSecreta}`;
        restartButton.style.display = "inline-block"; // Mostrar reinicio
        createCelebration(); // efecto de susto característico del nivel secreto
        desactivarTeclado();
    }

}

// Desactivar teclado y controles cuando termina el juego.
function desactivarTeclado() {
    const botones = keyboardDiv.querySelectorAll("button");
    botones.forEach(b => b.disabled = true); // desactiva todas las letras

    // Desactiva el botón de "probar palabra" y ajusta su estilo.
    const guessBtn = document.getElementById("guessButton");
    guessBtn.disabled = true;
    guessBtn.style.opacity = 0.5;
    guessBtn.style.opacity = 0.5;
    guessBtn.style.cursor = "not-allowed";

    // Desactiva el input de palabra completa.
    const guessInput = document.getElementById("guessInput");
    guessInput.disabled = true;
    guessInput.style.opacity = 0.5;

}

// Manejar el intento de adivinar la palabra completa.
guessButton.addEventListener("click", () => {
    document.getElementById("audio").play();
    const intento = guessInput.value.toLowerCase().trim(); // normaliza el texto
    if (!intento) return; // ignora si está vacío

    if (intento === palabraSecreta) {
        // Acierto: victoria instantánea.
        palabraMostrada = palabraSecreta.split("");
        actualizarVista();
        messageDiv.textContent = `¡Ganaste adivinando la palabra completa!`;
        restartButton.style.display = "inline-block";
        desactivarTeclado();
    } else {
        // Fallo: se consumen todos los intentos restantes borrando el muñeco parte por parte.
        const pasos = intentos;
        for (let i = 0; i < pasos; i++) {
            intentos--;
            dibujarAhorcado();
        }
        /*cuantas partes quedan por quitar
        decrementa para que dibujarAhorcado calcule la siguiente parte*/

        palabraMostrada = palabraSecreta.split(""); // revela la palabra

        dibujarAhorcado();
        actualizarVista();
        messageDiv.textContent = `¡Fallaste! La palabra era: ${palabraSecreta}`;
        restartButton.style.display = "inline-block"; // Mostrar reinicio

        createCelebration(); // efecto de susto

        desactivarTeclado();
    }
    guessInput.value = ""; // limpia el input
});

// Botón reiniciar: vuelve a empezar una partida y reactiva los controles.
function reiniciar() {
    restartButton.style.display = "none";
    nuevoJuego();
    guessInput.value = ""; // Limpiar input

    // Reactiva el botón de probar palabra.
    const guessBtns = document.getElementById("guessButton");
    guessBtns.disabled = false;
    guessBtns.style.opacity = 1; // quitar opacidad
    guessBtns.style.cursor = "pointer"; // volver cursor normal

    // Reactiva el input de palabra completa.
    const guessInputs = document.getElementById("guessInput");
    guessInputs.disabled = false;
    guessInputs.style.opacity = 1;
}

restartButton.addEventListener("click", reiniciar);


// ------------------------------ CANVAS ------------------------------

// Dibuja la estructura fija del ahorcado (base, postes y cuerda).
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


/* Limpia el canvas y dibuja el estado inicial del nivel secreto:
   la estructura más el muñeco COMPLETO (cabeza, cuerpo, brazos y piernas).
   A partir de ahí, cada fallo irá borrando una parte. */
function limpiarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    dibujarBase(); // Dibuja base y cuerda

    // Dibujar cuerpo completo de entrada
    ctx.beginPath();
    // Cabeza
    ctx.arc(200, 100, 20, 0, Math.PI * 2);
    ctx.stroke();
    // Cuerpo
    ctx.moveTo(200, 120);
    ctx.lineTo(200, 200);
    ctx.stroke();
    // Brazo izquierdo
    ctx.moveTo(200, 150);
    ctx.lineTo(170, 180);
    ctx.stroke();
    // Brazo derecho
    ctx.moveTo(200, 150);
    ctx.lineTo(230, 180);
    ctx.stroke();
    // Pierna izquierda
    ctx.moveTo(200, 200);
    ctx.lineTo(170, 240);
    ctx.stroke();
    // Pierna derecha
    ctx.moveTo(200, 200);
    ctx.lineTo(230, 240);
    ctx.stroke();
}



/* Borra una parte del muñeco según el número de fallos acumulados.
   Lógica invertida respecto al juego normal: en lugar de dibujar partes,
   se limpian rectángulos (clearRect) sobre las zonas del cuerpo. */
function dibujarAhorcado() {
    const partes = MAX_INTENTOS - intentos; // número de fallos acumulados

    // Cada caso borra una parte distinta del muñeco (de las piernas hacia la cabeza).
    switch (partes) {
        case 1: // Borra pierna derecha
            sonidoFallo.play();
            ctx.clearRect(200, 200, 35, 50);
            break;
        case 2: // Borra pierna izquierda
            sonidoFallo.play();
            ctx.clearRect(165, 200, 35, 50);
            break;
        case 3: // Borra brazo derecho
            sonidoFallo.play();
            ctx.clearRect(200, 150, 35, 40)
            break;
        case 4: // Borra brazo izquierdo
            sonidoFallo.play();
            ctx.clearRect(165, 150, 60, 60);
            break;
        case 5: // Borra cuerpo
            sonidoFallo.play();
            ctx.clearRect(198, 120, 4, 80);
            break;
        case 6: // Borra cabeza
            ctx.clearRect(170, 70, 60, 60);
            break;
    }
}
// ------------------------------ INICIO ------------------------------
limpiarCanvas(); // Dibuja el muñeco completo al iniciar
nuevoJuego();    // Comienza la primera partida
