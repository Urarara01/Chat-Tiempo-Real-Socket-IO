## ¿Quieres ejecutar backend y client frontend a la vez?
- En esta ruta: `npm install concurrently`
- Modifica tu package.json
```json
"scripts": {
    "dev": "concurrently \"node index.js\" \"npm --prefix client run dev\""
}
```
- En esta ruta: `npm run dev`

