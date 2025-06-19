const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://vannigoku:7156@cluster0.dn0jweo.mongodb.net/PAEC_Giovanni?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión:', err));

const AlumnoSchema = new mongoose.Schema({
  nombre: String,
  carrera: String,
  semestre: Number,
  tipo: String,
  pesoKg: Number
});

const Alumno = mongoose.model('Alumno', AlumnoSchema);

// Alta
app.post('/api/alta', async (req, res) => {
  try {
    const nuevo = new Alumno(req.body);
    await nuevo.save();
    res.redirect('/visualizar.html');
  } catch (err) {
    res.status(500).send('Error al guardar');
  }
});

// Ver todos
app.get('/api/alumnos', async (req, res) => {
  const alumnos = await Alumno.find();
  res.json(alumnos);
});

// Baja
app.post('/api/baja', async (req, res) => {
  await Alumno.deleteOne({ nombre: req.body.nombre });
  res.redirect('/visualizar.html');
});

// Actualizar
app.post('/api/actualizar', async (req, res) => {
  await Alumno.updateOne({ nombre: req.body.nombreOriginal }, {
    nombre: req.body.nombreNuevo,
    carrera: req.body.carrera,
    semestre: req.body.semestre,
    tipo: req.body.tipo,
    pesoKg: req.body.pesoKg
  });
  res.redirect('/visualizar.html');
});

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});
