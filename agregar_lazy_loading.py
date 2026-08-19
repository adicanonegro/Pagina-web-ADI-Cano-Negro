"""
agregar_lazy_loading.py
------------------------
Agrega automaticamente el atributo loading="lazy" a TODAS las etiquetas
<img> de tus archivos .html, para que el navegador solo cargue las fotos
que estan a la vista (en vez de todas de una vez al abrir la pagina).

COMO USARLO:
1. Copia este archivo en la RAIZ de tu proyecto (junto a index.html).
2. Corre:
       python agregar_lazy_loading.py

Que hace exactamente:
 - Busca todos los archivos .html del proyecto (index.html y los que
   esten dentro de la carpeta HTML/ y sus subcarpetas).
 - En cada <img ...> que NO tenga ya el atributo loading, le agrega
   loading="lazy" automaticamente.
 - No toca nada mas: no cambia src, alt, clases, ni el resto del codigo.
 - Es seguro correrlo varias veces (si una imagen ya tiene loading, la
   deja como esta).
 - Guarda un respaldo de cada .html original en html_originales_backup/
   antes de modificarlo, por si algo sale mal.
"""

import re
import shutil
from pathlib import Path

CARPETA_BACKUP = Path("html_originales_backup")

# Encuentra etiquetas <img ...> (sin cerrar, formato HTML habitual)
PATRON_IMG = re.compile(r"<img\b([^>]*?)(/?)>", re.IGNORECASE)


def ya_tiene_loading(atributos: str) -> bool:
    return re.search(r"\bloading\s*=", atributos, re.IGNORECASE) is not None


def agregar_lazy(match: re.Match) -> str:
    atributos, cierre = match.group(1), match.group(2)

    if ya_tiene_loading(atributos):
        return match.group(0)

    partes = [p for p in [atributos.strip(), 'loading="lazy"'] if p]
    atributos_final = " ".join(partes)
    cierre_final = " " + cierre if cierre else ""
    return f"<img {atributos_final}{cierre_final}>"


def procesar_archivo(ruta: Path) -> tuple[int, int]:
    contenido = ruta.read_text(encoding="utf-8")

    coincidencias = list(PATRON_IMG.finditer(contenido))
    total_imgs = len(coincidencias)
    faltaban_antes = sum(1 for m in coincidencias if not ya_tiene_loading(m.group(1)))

    if faltaban_antes == 0:
        return total_imgs, 0

    nuevo_contenido = PATRON_IMG.sub(agregar_lazy, contenido)

    ruta_backup = CARPETA_BACKUP / ruta.name
    if not ruta_backup.exists():
        ruta_backup.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ruta, ruta_backup)

    ruta.write_text(nuevo_contenido, encoding="utf-8")
    return total_imgs, faltaban_antes


def main():
    raiz = Path(".")
    archivos_html = sorted(raiz.rglob("*.html"))
    archivos_html = [
        f for f in archivos_html
        if CARPETA_BACKUP.name not in f.parts and "node_modules" not in f.parts
    ]

    if not archivos_html:
        print("No se encontraron archivos .html en el proyecto.")
        return

    total_imgs = 0
    total_modificadas = 0

    for ruta in archivos_html:
        vistas, modificadas = procesar_archivo(ruta)
        total_imgs += vistas
        total_modificadas += modificadas
        if modificadas:
            print(f'  {ruta}: {modificadas} de {vistas} <img> actualizadas con loading="lazy"')
        else:
            print(f"  {ruta}: sin cambios ({vistas} <img>, ya tenian loading o no hay imagenes)")

    print()
    print(f"TOTAL: {total_modificadas} etiquetas <img> actualizadas en {len(archivos_html)} archivos .html")


if __name__ == "__main__":
    main()
