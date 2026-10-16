SyncArena — Mezcla Adapter + Bridge (sistema de controles)
================================================================

Archivos:
- dispositivoEntrada.js        -> Interfaz comun: target del Adapter = Implementor del Bridge
- dispositivosNativos.js       -> 3 dispositivos simulados con APIs incompatibles
                                   (TecladoNativo, MandoNativo, PantallaTactilNativa)
- adaptadoresDispositivo.js    -> Los 3 Adapters (TecladoAdapter, MandoAdapter,
                                   PantallaTactilAdapter)
- esquemaControl.js            -> Abstraccion del Bridge: EsquemaControl
- esquemasConcretos.js         -> Esquemas concretos: Estandar, Invertido, Accesibilidad
                                   (el aporte principal, junto con esquemaControl.js)
- controles.test.js            -> 10 pruebas con el test runner nativo de Node
- demoControles.js             -> Demo ejecutable: matriz 3x3 + cambio de dispositivo en caliente

Como ejecutar:
1. Requiere Node.js 18+ (probado con Node 22)
2. Correr todas las pruebas:      node --test
3. Correr la demo:                node demoControles.js

No requiere `npm install`, no usa dependencias externas.
