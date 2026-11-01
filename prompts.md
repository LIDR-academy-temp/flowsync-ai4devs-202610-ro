# Prompts

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
@"/home/noureddine/Baixades/BORRAR/Ejercicio_FlowSync_spec_viva.pdf" @"/home/noureddine/Baixades/BORRAR/Resumen_SDD-aware_y_lidr-specboot.pdf" @"/home/noureddine/Baixades/BORRAR/Resumen_OpenSpec_en_profundidad.pdf" @"/home/noureddine/Baixades/BORRAR/Resumen_Loop_Explore_Plan_Execute.pdf" @"/home/noureddine/Baixades/BORRAR/Resumen_Los_dos_caminos_OpenSpec.pdf"
antes de hacer nada no regestras eso y lee los reseomines y despues analisa el ejersisrio y hasto paso a paso
```

**Qué salió:** leyó los resúmenes y el enunciado, exploró el código de cuentas y acceso (backend, frontend y fuentes del framework para los códigos 400/401) y escribió `docs/spec-viva/na.md` con 16 requisitos (en realidad eran 15: lo contó mal) y las tres listas. No tocó código.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
repasa los pasos para mejorar el resultado y intala el node 24
```

**Qué salió:** Node 24 ya estaba instalado con nvm y lo dejó como versión por defecto. Completó el setup (clave, migraciones, recompilar SQLite, `npm ci` del frontend), arrancó backend y frontend, y probó la API con curl y las pantallas en el navegador. Al ejecutar salió que una incoherencia era falsa (la API sí convierte un nombre en blanco en `null`), que faltaban 3 scenarios y que eran 15 requisitos, no 16. Añadió dos incoherencias nuevas (mensajes en minúscula y error 400 con traza) y confirmó con pruebas el caso de los emails con mayúsculas.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
instala todo lo que haga falta para ejersisio
```

**Qué salió:** instaló OpenSpec 1.16.0 de forma global, inicializó `~/openspec-sandbox` para Claude Code (comandos `/opsx` creados) y desactivó la telemetría.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
verefica las vercion y todo lo que hace falta
```

**Qué salió:** todo correcto con Node 24, pero las terminales nuevas seguían usando Node 22 porque `~/.bashrc` no cargaba nvm.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
actuallisa node -v
v22.22 a v24
```

**Qué salió:** añadió la carga de nvm a `~/.bashrc`; `node -v` responde v24.22.0 en terminales nuevas.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
ahora mera el ejersisio y deme que falta para instalar
```

**Qué salió:** repasó el checklist; no faltaba nada por instalar.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (app de escritorio)

```
repasamos los ponto del eersisio y analisa lo que lafta y haslo
```

**Qué salió:** validó la spec contra los criterios del ejercicio, dejó a 0 los requisitos revisados a mano, hizo el commit y el push a mi fork. El PR lo abrí yo desde GitHub.
