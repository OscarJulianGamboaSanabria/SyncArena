SyncArena — Patron Builder (configuracion de partidas)
=========================================================

Archivos:
- partidaConfig.js            -> Producto: configuracion inmutable de una partida
- partidaConfigBuilder.js     -> Builder + Director (el aporte principal)
- partidaConfigBuilder.test.js -> 11 pruebas con el test runner nativo de Node
- demoConfiguracionPartida.js -> Demo ejecutable de uso

Como ejecutar:
1. Requiere Node.js 18+ (probado con Node 22)
2. Correr todas las pruebas:      node --test
3. Correr la demo:                node demoConfiguracionPartida.js

No requiere `npm install`, no usa dependencias externas.
