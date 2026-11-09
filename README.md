# Juego del Ahorcado

Juego del Ahorcado desarrollado con HTML, CSS y JavaScript puro, sin frameworks ni dependencias externas. El objetivo es adivinar la palabra secreta letra por letra antes de que se complete el dibujo del ahorcado. Incluye varios niveles de dificultad, música de fondo, efectos de sonido y un nivel secreto oculto.

## Características

- Tres niveles de dificultad con listas de palabras temáticas distintas.
- Nivel secreto oculto que se desbloquea mediante un código de teclado.
- Teclado virtual (A–Z) para seleccionar letras con el ratón.
- Intento de palabra completa: el jugador puede arriesgarse a escribir toda la palabra de una vez.
- Dibujo del ahorcado renderizado en un elemento `<canvas>`, construido progresivamente con cada fallo.
- Máximo de 6 fallos permitidos antes de perder la partida.
- Efectos visuales y de sonido: lluvia de confeti al ganar, música de fondo por nivel y sonidos de victoria, derrota y error.
- Reinicio de la partida sin necesidad de recargar la página.
- Tipografías de estilo retro (`Press Start 2P` y `Orbitron`) cargadas desde Google Fonts.

## Reglas del juego

- El objetivo es adivinar la palabra secreta antes de que el muñeco quede completo.
- Cada letra fallada dibuja una parte del ahorcado. Solo se dispone de 6 fallos.
- El jugador puede escribir la palabra completa para arriesgarse: si acierta gana de inmediato, pero si falla pierde automáticamente.
- El juego contiene sonidos fuertes y escenas de tensión, según la advertencia mostrada en la pantalla de inicio.

## Estructura del proyecto

```
AhorcadoGame/
├── index.html                  # Menú principal: reglas y selección de nivel
├── niveles/
│   ├── nivel_facil.html        # Nivel fácil   (temática: animales y granja)
│   ├── nivel_medio.html        # Nivel medio   (temática: clima)
│   ├── nivel_dificil.html      # Nivel difícil (temática: espacio y astronomía)
│   └── nivel_secreto.html      # Nivel secreto oculto (palabras muy largas)
├── script/
│   ├── funcionalidad.js        # Lógica de los niveles fácil, medio y difícil
│   └── funcionalidad_secret.js # Lógica del nivel secreto
├── styles/
│   ├── styles.css              # Estilos del menú principal
│   ├── facil_styles.css        # Estilos del nivel fácil
│   ├── medio_styles.css        # Estilos del nivel medio
│   ├── dificl_styles.css       # Estilos del nivel difícil
│   ├── secreto_styles.css      # Estilos del nivel secreto
│   └── responsive.css          # Ajustes para tablets y celulares (niveles)
├── audio/                      # Música de fondo y efectos de sonido
└── img/                        # Fondos, logotipos e íconos
```

## Niveles

| Nivel       | Página                       | Temática de las palabras           | Música             |
|-------------|------------------------------|------------------------------------|--------------------|
| Fácil       | `niveles/nivel_facil.html`   | Palabras cortas: animales y granja | `facilMusic.mp3`   |
| Medio       | `niveles/nivel_medio.html`   | Fenómenos del clima                | `medioMusic.mp3`   |
| Difícil     | `niveles/nivel_dificil.html` | Espacio y astronomía               | `dificilMusic.mp3` |
| Secreto     | `niveles/nivel_secreto.html` | Palabras extremadamente largas     | `secretMusic.mpeg` |

Cada nivel selecciona aleatoriamente una palabra de su propio arreglo `palabras`, definido dentro del `<head>` de la página del nivel.

### Nivel secreto

En el menú principal (`index.html`), escribe con el teclado la siguiente secuencia:

```
helpme
```

Al completar la secuencia, el juego redirige automáticamente a `nivel_secreto.html`. En este nivel la mecánica se invierte: el muñeco aparece dibujado por completo desde el inicio y cada fallo borra una de sus partes, con una estética "glitch" y sonidos distintos a los del resto del juego.

## Cómo ejecutarlo

Al tratarse de un proyecto de solo cliente (HTML, CSS y JavaScript estático), no requiere instalación ni compilación.

Opción 1 — Abrir directamente:

Abre `index.html` en el navegador.

Opción 2 — Servidor local (recomendado):

Para que la música y el resto de recursos se carguen sin restricciones del navegador, sirve la carpeta con un servidor estático:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npx)
npx serve
```

Después abre `http://localhost:8000` en el navegador.

Nota: muchos navegadores bloquean la reproducción automática de audio hasta que el usuario interactúa con la página. Por ese motivo la música se inicia con el primer clic o pulsación de tecla.

## Detalles técnicos

- Sin dependencias ni proceso de compilación. Únicamente HTML, CSS y JavaScript nativo.
- El dibujo del ahorcado utiliza la API de Canvas 2D (`getContext("2d")`).
- La constante `MAX_INTENTOS = 6` define el número máximo de fallos permitidos.
- El estado de la partida (palabra secreta, letras usadas e intentos restantes) se gestiona en memoria; no existe persistencia entre recargas.
- La lógica compartida por los niveles normales reside en `script/funcionalidad.js`; el nivel secreto emplea su propia variante en `script/funcionalidad_secret.js`.

## Compatibilidad

El juego funciona en navegadores modernos de escritorio con soporte para HTML5 Canvas y la etiqueta `<audio>` (Chrome, Firefox, Edge). El diseño es responsivo: se adapta a tablets y celulares (vertical y horizontal) con media queries en `styles/responsive.css` (niveles) y al final de `styles/styles.css` (menú), con botones táctiles de al menos 44px y teclado virtual de 7 columnas en celular.

## Licencia

Distribuido bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.
