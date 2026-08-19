"""
optimizar_imagenes.py
----------------------
Recorre la carpeta img/ del proyecto y comprime/redimensiona todas las
fotos para que pesen mucho menos, sin perder calidad visible en la web.

COMO USARLO:
1. Este archivo ya esta en la RAIZ del proyecto (junto a index.html).
2. Instala Pillow una sola vez: pip install pillow
3. Corre:
       python optimizar_imagenes.py

Que hace exactamente:
 - Busca todas las imagenes dentro de img/ y sus subcarpetas.
 - Si una imagen mide mas de 1920px de ancho, la reduce a 1920px
   (manteniendo la proporcion). Las que ya son mas chicas no se tocan
   en tamano, solo se comprimen.
 - Guarda cada imagen con el MISMO nombre y la MISMA extension
   (respeta mayusculas, ej: FOTO.JPG sigue siendo FOTO.JPG).
 - Antes de tocar una imagen, guarda una copia intacta en
   img_originales_backup/ (misma estructura de carpetas), por si algo
   sale mal o queres recuperar la original.
 - Es seguro correrlo varias veces: si una imagen ya tiene backup,
   asume que ya fue optimizada antes y la salta (asi no la comprime
   dos veces y no pierde mas calidad de la necesaria).
 - Al final muestra cuanto pesaba todo antes, cuanto pesa despues, y
   el porcentaje de ahorro total.
 - Los formatos RAW (.CR2, .NEF, etc.) no los puede abrir Pillow: se
   listan aparte para que los conviertas a JPG a mano si hace falta.
"""

import shutil
from pathlib import Path
from PIL import Image, ImageOps

CARPETA_IMG = Path("img")
CARPETA_BACKUP = Path("img_originales_backup")
ANCHO_MAXIMO = 1920
CALIDAD_JPEG = 82

EXTENSIONES_SOPORTADAS = {
    ".jpg": "JPEG",
    ".jpeg": "JPEG",
    ".png": "PNG",
    ".webp": "WEBP",
    ".gif": "GIF",
}


def formatear_bytes(n):
    for unidad in ["B", "KB", "MB", "GB"]:
        if n < 1024:
            return f"{n:.1f} {unidad}"
        n /= 1024
    return f"{n:.1f} TB"


def optimizar_una_imagen(ruta: Path, formato: str) -> tuple[int, int]:
    peso_antes = ruta.stat().st_size

    ruta_backup = CARPETA_BACKUP / ruta.relative_to(CARPETA_IMG)
    if ruta_backup.exists():
        # Ya se proceso antes en una corrida anterior: no la tocamos de nuevo.
        return peso_antes, peso_antes

    ruta_backup.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(ruta, ruta_backup)

    with Image.open(ruta) as img:
        img = ImageOps.exif_transpose(img)  # respeta la rotacion original

        if img.width > ANCHO_MAXIMO:
            nueva_alto = round(img.height * (ANCHO_MAXIMO / img.width))
            img = img.resize((ANCHO_MAXIMO, nueva_alto), Image.LANCZOS)

        kwargs = {"optimize": True}
        if formato == "JPEG":
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            kwargs["quality"] = CALIDAD_JPEG
        elif formato == "PNG":
            kwargs["compress_level"] = 9
        elif formato == "WEBP":
            kwargs["quality"] = CALIDAD_JPEG

        img.save(ruta, format=formato, **kwargs)

    peso_despues = ruta.stat().st_size
    return peso_antes, peso_despues


def main():
    if not CARPETA_IMG.exists():
        print(f'No se encontro la carpeta "{CARPETA_IMG}". Corre este script desde la raiz del proyecto.')
        return

    total_antes = 0
    total_despues = 0
    sin_soporte = []

    archivos = sorted(p for p in CARPETA_IMG.rglob("*") if p.is_file())

    for ruta in archivos:
        ext = ruta.suffix.lower()
        formato = EXTENSIONES_SOPORTADAS.get(ext)

        if formato is None:
            sin_soporte.append(ruta)
            continue

        try:
            antes, despues = optimizar_una_imagen(ruta, formato)
        except Exception as e:
            print(f"  [ERROR] No se pudo procesar {ruta}: {e}")
            continue

        total_antes += antes
        total_despues += despues

        if antes == despues:
            print(f"  (sin cambios, ya optimizada) {ruta}")
        else:
            ahorro = 100 * (1 - despues / antes) if antes else 0
            print(f"  {ruta}: {formatear_bytes(antes)} -> {formatear_bytes(despues)}  (-{ahorro:.0f}%)")

    print()
    if total_antes:
        ahorro_total = 100 * (1 - total_despues / total_antes)
        print(f"TOTAL: {formatear_bytes(total_antes)} -> {formatear_bytes(total_despues)}  (-{ahorro_total:.0f}%)")
    else:
        print("No se encontraron imagenes para optimizar.")

    if sin_soporte:
        print()
        print("Estos archivos no se pudieron procesar (formato no soportado, ej. RAW .CR2):")
        for r in sin_soporte:
            print(f"  - {r}")
        print("Convertilos a .jpg manualmente y volve a correr el script si queres optimizarlos tambien.")


if __name__ == "__main__":
    main()
