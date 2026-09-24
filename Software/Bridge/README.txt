SyncArena — Patron Bridge (tipo de sesion vs. canal de red)
================================================================

Archivos:
- canalComunicacion.js     -> Implementor: contrato de cualquier canal de red
- canalesConcretos.js      -> Implementaciones concretas: CanalWebSocket, CanalUDP
- sesionJuego.js           -> Abstraccion: SesionJuego, guarda una referencia al canal
- sesionesConcretas.js     -> Abstracciones refinadas: PartidaCasual, PartidaClasificada,
                               PartidaTorneo (el aporte principal, junto con sesionJuego.js)
- bridge.test.js           -> 9 pruebas con el test runner nativo de Node
- demoBridge.js            -> Demo ejecutable: matriz de 6 combinaciones sesion x canal

Como ejecutar:
1. Requiere Node.js 18+ (probado con Node 22)
2. Correr todas las pruebas:      node --test
3. Correr la demo:                node demoBridge.js

No requiere `npm install`, no usa dependencias externas.
