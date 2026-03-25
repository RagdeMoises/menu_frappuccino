import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Servir archivos estáticos de la build
app.use(express.static(path.join(__dirname, 'build')));

// Todas las rutas van al index.html (para React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  //console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default app;