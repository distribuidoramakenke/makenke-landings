#!/usr/bin/env python3
"""Herramientas del repo de landings Makenke.

  python tools/landings.py nueva <slug>      crea una landing nueva desde _plantilla
  python tools/landings.py indice            regenera el índice interno (index.html)
  python tools/landings.py imagenes <origen> <destino>   convierte fotos a WebP liviano (máx. 800 px)

Ejemplo:
  python tools/landings.py nueva cuidado-de-pisos
  python tools/landings.py imagenes "C:/Users/plima/Documents/proyectos/makenke/imagenes/Pisos" cuidado-de-pisos/img
"""
import re, sys, shutil
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
EXCLUIR = {"assets", "tools", "node_modules"}


def landings():
    return sorted(p for p in RAIZ.iterdir()
                  if p.is_dir() and not p.name.startswith((".", "_")) and p.name not in EXCLUIR
                  and (p / "index.html").exists())


def titulo(p):
    m = re.search(r"<title>(.*?)</title>", (p / "index.html").read_text(encoding="utf-8"), re.S)
    return m.group(1).strip() if m else p.name


def indice():
    items = "\n".join(f'<li><a href="/{p.name}/">{titulo(p)}</a> <code>/{p.name}/</code></li>' for p in landings())
    html = f'''<!DOCTYPE html>
<html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Landings Makenke</title>
<style>body{{font-family:system-ui,sans-serif;background:#141310;color:#ECEBE6;max-width:640px;margin:40px auto;padding:0 20px}}
a{{color:#EFBE00}}li{{margin:14px 0}}code{{color:#8f8d84;font-size:.85em}}</style></head><body>
<h1>Landings Makenke</h1><p>Índice interno. Cada campaña apunta a una de estas páginas.</p><ul>
{items}
</ul></body></html>'''
    (RAIZ / "index.html").write_text(html, encoding="utf-8")
    print("Índice actualizado:", ", ".join(p.name for p in landings()))


def nueva(slug):
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", slug):
        sys.exit("El slug va en minúsculas, sin tildes ni espacios, con guiones. Ej: cuidado-de-pisos")
    destino = RAIZ / slug
    if destino.exists():
        sys.exit(f"Ya existe {slug}/")
    shutil.copytree(RAIZ / "_plantilla", destino)
    (destino / "img").mkdir()
    pagina = destino / "index.html"
    pagina.write_text(pagina.read_text(encoding="utf-8").replace("{{SLUG}}", slug), encoding="utf-8")
    indice()
    print(f"""
Landing creada en {slug}/index.html
1. Reemplazá los {{{{TEXTOS}}}} que quedaron entre llaves.
2. Pasá las fotos por:  python tools/landings.py imagenes <carpeta-origen> {slug}/img
3. Probala en tu compu: python -m http.server 8000  y abrí http://localhost:8000/{slug}/
4. Link para la campaña:
   https://TU-DOMINIO/{slug}/?utm_source=instagram&utm_medium=paid&utm_campaign={slug}-AAAAMM""")


def imagenes(origen, destino):
    from PIL import Image
    destino = Path(destino); destino.mkdir(parents=True, exist_ok=True)
    for f in Path(origen).iterdir():
        if f.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}:
            im = Image.open(f).convert("RGBA"); fondo = Image.new("RGB", im.size, "white"); fondo.paste(im, mask=im.split()[3])
            fondo.thumbnail((800, 800))
            nombre = re.sub(r"[^a-z0-9]+", "-", f.stem.lower()).strip("-") + ".webp"
            fondo.save(destino / nombre, "WEBP", quality=80)
            print(nombre)


if __name__ == "__main__":
    a = sys.argv[1:]
    if a[:1] == ["nueva"] and len(a) == 2: nueva(a[1])
    elif a[:1] == ["indice"]: indice()
    elif a[:1] == ["imagenes"] and len(a) == 3: imagenes(a[1], a[2])
    else: print(__doc__)
