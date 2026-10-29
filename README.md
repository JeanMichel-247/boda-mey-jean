# Invitación digital — Mey & Jean

Invitación interactiva estática para GitHub Pages.

## Estructura

- `index.html` — invitación.
- `style.css` — diseño y animaciones.
- `script.js` — navegación, personalización, música y calendario.
- `config.js` — textos, ubicación y enlaces editables.
- `generador.html` — genera enlaces personalizados por invitado.
- `assets/` — imágenes y música.

## Personalización por invitado

Ejemplo:

`index.html?invitado=María%20Rodríguez&lugares=2`

El nombre y la cantidad de lugares se muestran en una página especial.

El archivo `generador.html` permite crear estos enlaces sin escribir la URL manualmente.

### Importante

Como GitHub Pages es un sitio estático, los datos enviados en la URL no son una base de datos privada. No coloque información sensible. Para una lista de invitados completamente privada y un sistema administrativo real, habría que añadir un backend (por ejemplo Firebase/Supabase).

## Música

Coloque el archivo:

`assets/musica.mp3`

La música se intenta iniciar al abrir el libro, pero los navegadores pueden bloquear la reproducción automática. El botón 🔇/🔊 permite activarla manualmente.

## RSVP

Abra `config.js` y cambie:

`rsvpUrl: "PEGAR_AQUI_URL_DEL_FORMULARIO"`

Si quiere que el formulario reciba automáticamente el nombre y número de lugares, cree una URL prellenada de Google Forms y la podemos integrar con los parámetros exactos del formulario.

## Calendario

La invitación ya incluye:
- enlace a Google Calendar;
- descarga de `.ics` compatible con Apple Calendar, Outlook y otras aplicaciones.

## Publicar en GitHub Pages

1. Cree un repositorio en GitHub.
2. Suba todos los archivos manteniendo la estructura.
3. En Settings → Pages seleccione la rama `main` y la carpeta `/ (root)`.
4. GitHub publicará el sitio.

La dirección de un proyecto normalmente será:

`https://USUARIO.github.io/NOMBRE-REPOSITORIO/`

También puede usar un dominio personalizado.

## Próximo paso recomendado

Después de subirlo, podemos ajustar:
- tamaño y escala del libro;
- velocidad del paso de página;
- sonido de páginas;
- música;
- animaciones ornamentales;
- formulario RSVP;
- textos;
- botones;
- versión móvil;
- dominio y QR.
