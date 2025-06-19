const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware para leer JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta pública
app.use(express.static(path.join(__dirname, 'public')));

// === CONEXIÓN A MONGODB ATLAS ===
const mongoURI = 'mongodb+srv://vannigoku:7156@cluster0.dn0jweo.mongodb.net/PAEC_Giovanni?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión:', err));

// === ESQUEMA Y MODELO ===
const proyectoSchema = new mongoose.Schema({
  titulo: String,
  categoria: String,
  descripcion: String,
  responsable: String,
  participantes: Number,
  fecha: String,
  estatus: String
});

// Usa exactamente la colección 'proyectos_reciclaje'
const Proyecto = mongoose.model('Proyecto', proyectoSchema, 'proyectos_reciclaje');

// === RUTAS API ===

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

// Actualizar proyecto por ID
app.put('/api/proyectos/:id', async (req, res) => {
  try {
    const actualizado = await Proyecto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar proyecto por ID
app.delete('/api/proyectos/:id', async (req, res) => {
  try {
    const eliminado = await Proyecto.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.json({ message: 'Proyecto eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === PUERTO DEL SERVIDOR ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

