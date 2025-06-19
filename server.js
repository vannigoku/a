const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware para parsear JSON y datos de formularios URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// URI de conexión a MongoDB desde variable de entorno
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión:', err));

// Definición del esquema y modelo de Proyecto
const proyectoSchema = new mongoose.Schema({
  titulo: String,
  categoria: String,
  descripcion: String,
  responsable: String,
  participantes: Number,
  fecha: String,
  estatus: String
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema);

// Rutas API REST

// Obtener todos los proyectos
app.get('/api/proyectos', async (req, res) => {
  try {
    const proyectos = await Proyecto.find();
    res.json(proyectos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo proyecto
app.post('/api/proyectos', async (req, res) => {
  try {
    const nuevoProyecto = new Proyecto(req.body);
    const guardado = await nuevoProyecto.save();
    res.status(201).json(guardado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar un proyecto por id
app.put('/api/proyectos/:id', async (req, res) => {
  try {
    const actualizado = await Proyecto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un proyecto por id
app.delete('/api/proyectos/:id', async (req, res) => {
  try {
    const eliminado = await Proyecto.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.json({ message: 'Proyecto eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
