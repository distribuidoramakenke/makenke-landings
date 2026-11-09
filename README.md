# Landings Makenke

Un solo repositorio, un solo proyecto en Vercel, una carpeta por landing.
Cada campaña en redes apunta a su propia dirección: `https://DOMINIO/<slug>/`.

## Estructura

```
assets/            lo compartido por todas las landings
  css/base.css       estilos (marca, botones, tarjetas, animaciones)
  js/main.js         WhatsApp flotante, UTM, datos del negocio (teléfono, mapa, Instagram)
  img/brand/         logo de Makenke
<slug>/            UNA carpeta por landing (ej. limpieza-cocina-profesional/)
  index.html         la página
  img/               fotos de ESA landing, en WebP
_plantilla/        punto de partida para landings nuevas
tools/landings.py  crea landings, actualiza el índice y optimiza fotos
vercel.json        configuración de Vercel (URLs limpias, caché)
index.html         índice interno (no se indexa en Google)
```

Regla de oro: **lo que cambia para todas** (WhatsApp, horario, estilos) se toca en `assets/`;
**lo que es de un producto** (textos, fotos) se toca solo dentro de su carpeta.

## Carpeta local recomendada

```
proyectos/makenke/
  imagenes/            ORIGINALES pesados (PNG, PSD, videos). No van a Git.
  landings/            clon de este repositorio (acá se trabaja)
```

Las fotos originales se quedan en `imagenes/`. Al repositorio entran solo copias livianas
(`python tools/landings.py imagenes <origen> <slug>/img`), máximo 800 px en WebP.
Los videos pesados no van al repo: se suben a YouTube o Instagram y se enlazan.

## Flujo de trabajo (Git + Vercel)

- `main` = producción. Todo lo que entra a `main` se publica solo en Vercel.
- Cada landing nueva o cambio grande se trabaja en una **rama**: `git switch -c landing/cuidado-de-pisos`.
- Al subir la rama (`git push -u origin landing/cuidado-de-pisos`) Vercel genera una **URL de prueba** para revisarla en el celular.
- Cuando está lista: Pull Request en GitHub y **Merge** a `main`. Eso la publica.
- Si algo sale mal: en Vercel → Deployments → el anterior → **Promote to Production**.

## Crear una landing nueva

```
git switch -c landing/<slug>
python tools/landings.py nueva <slug>
python tools/landings.py imagenes "<carpeta con fotos originales>" <slug>/img
python -m http.server 8000        # probar en http://localhost:8000/<slug>/
git add . && git commit -m "Landing <slug>" && git push -u origin landing/<slug>
```

Reemplazá los textos `{{ASÍ}}` de la plantilla y copiá bloques de la landing existente
(`limpieza-cocina-profesional/index.html`) para productos, accesorios o pasos.

## Convención de links para campañas (UTM)

Cada anuncio usa su propio link:

```
https://DOMINIO/<slug>/?utm_source=<instagram|facebook|google|whatsapp>&utm_medium=<paid|organic|story|bio>&utm_campaign=<slug>-<AAAAMM>
```

Ejemplo: `https://DOMINIO/limpieza-cocina-profesional/?utm_source=instagram&utm_medium=paid&utm_campaign=cocina-202611`

La página recuerda de dónde vino la persona y agrega al mensaje de WhatsApp una referencia
`(ref: landing / red / campaña)`. Así, cada consulta que llega dice qué anuncio la generó.
Vercel Analytics muestra el tráfico por origen y por página.

## Datos del negocio

Teléfono, WhatsApp, Instagram y mapa están en `assets/js/main.js` (objeto `NEGOCIO`).
Horarios y dirección están escritos en el bloque "Vení al local" de cada página.

## Vercel

- Un único proyecto conectado a este repositorio, rama de producción `main`.
- Framework preset: **Other**. Build command: vacío. Output directory: vacío.
- Recomendado: renombrar el proyecto a `makenke-landings` y, más adelante, conectar un dominio propio.
