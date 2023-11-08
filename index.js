const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3000; 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de CORS
app.use(cors());

// Configura la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
  

// Conectar a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');
  }
});

// Ruta para obtener todos los estudiantes
app.get('/students', (req, res) => {
  db.query('SELECT * FROM student', (err, results) => {
    if (err) {
      console.error('Error al recuperar estudiantes:', err);
      res.status(500).json({ error: 'Error al recuperar estudiantes' });
    } else {
      res.json(results);
    }
  });
});

// Ruta para agregar un estudiante
app.post('/students', (req, res) => {
  const { name, lastname, sex } = req.body;
  db.query('INSERT INTO student (name, lastname, sex) VALUES (?, ?, ?)', [name, lastname, sex], (err, result) => {
    if (err) {
      console.error('Error al agregar estudiante:', err);
      res.status(500).json({ error: 'Error al agregar estudiante' });
    } else {
      res.json({ message: 'Estudiante agregado con éxito' });
    }
  });
});

// Ruta para actualizar un estudiante por ID
app.put('/students/:id', (req, res) => {
  const { name, lastname, sex } = req.body;
  const id = req.params.id;
  db.query('UPDATE student SET name = ?, lastname = ?, sex = ? WHERE idstudent = ?', [name, lastname, sex, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar estudiante:', err);
      res.status(500).json({ error: 'Error al actualizar estudiante' });
    } else {
      res.json({ message: 'Estudiante actualizado con éxito' });
    }
  });
});

// Ruta para eliminar un estudiante por ID
app.delete('/students/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM student WHERE idstudent = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar estudiante:', err);
      res.status(500).json({ error: 'Error al eliminar estudiante' });
    } else {
      res.json({ message: 'Estudiante eliminado con éxito' });
    }
  });
});


app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
