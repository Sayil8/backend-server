//requires  
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//inicializar variables
var app = express();

//bodyparser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// impotar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospitales');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imgRoutes = require('./routes/images');


//conexion a la bd

mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, res) => {
    if (err) throw err;

    console.log("Base de datos: \x1b[32m%s\x1b[0m", "online");
})

//rutas
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/login', loginRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imgRoutes);
app.use('/', appRoutes);


//escuchar peticiones

app.listen(3000, () => {
    console.log("Server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m", "online");
});