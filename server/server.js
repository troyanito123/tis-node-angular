require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// configuracion CORS
app.use(cors());

// parse application/json
app.use(bodyParser.json());

//Configuracion global de rutas
app.use(require('./routes/index'));

//Conexion a base de datos
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true}, (err, res) => {
    if(err) throw err;
    console.log('Base de datos ONLINE');
});

//Levantando el servidor
app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
});