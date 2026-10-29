# 🌟 Aprende a Leer con Nil

Una aplicación web educativa y gamificada diseñada para niños en primero de primaria. Su objetivo es facilitar el aprendizaje de la lectoescritura mediante el método silábico y el refuerzo fonológico, evitando la frustración y fomentando la autonomía.

🎮 **[Juega la demo aquí](https://leax9.github.io/aprende-a-leer/)**

## ✨ Características Principales
* **Sistema de Recompensas:** Las estrellas ganadas se guardan automáticamente en la memoria de la tablet (Local Storage) para no perder el progreso entre sesiones.
* **Mecánica "Tocar para Colocar":** Diseñada específicamente para pantallas táctiles. Evita los problemas del "arrastrar y soltar"; basta con tocar la sílaba correcta para que viaje a su sitio.
* **Refuerzo Auditivo Nativo:** Utiliza la Web Speech API para leer en voz alta cada sílaba al tocarla y la palabra completa al finalizar, ayudando a la conciencia fonológica.
* **Sesiones sin Repeticiones:** Algoritmo de barajado (Fisher-Yates) que garantiza que las palabras no se repitan dentro de la misma ronda.
* **Multilenguaje y Adaptable:** Estructura de datos en JSON preparada de base para Castellano y Catalán, fácilmente escalable a nuevos idiomas.

## 🚀 Despliegue
Al estar desarrollada en HTML, CSS y JavaScript (Vanilla JS), no requiere backend.

1. Sube los archivos a tu repositorio de GitHub.
2. Ve a **Settings > Pages**, selecciona la rama `main` y guarda para publicar la web.

## 🗺️ Roadmap (Próximas Mejoras)
- [ ] Sustituir los emojis temporales por ilustraciones infantiles atractivas y sin copyright.
- [ ] Añadir selector de niveles de dificultad (bisílabas simples, trisílabas, sílabas trabadas).
- [ ] Implementar nuevos minijuegos ("La sílaba perdida", "El detective").
