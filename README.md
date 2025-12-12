Comandos para hacer andar el proyecto:

Antes de todo, debes crear la base de datos local, para ello ejecuta este comando.
`node database.js`

Ahora debes abrir el backend, para ello ejecuta este otro comando.
`node index.js` 
El SocketIO que escuchará y comunicará los mensajes en tiempo real.

Luego para el frontend necesitarás acceder a la carpeta client con 
`cd client`
y ejecutar:
`npm run build`

Con eso se ejecuta el frontend con un puerto en 5173

Ahora solo te queda entrar a http://localhost:5173/
y probar el funcionamiento del chat.
