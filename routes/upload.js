var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospitales');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de coleccion

    var tiposVaidos = ['usuarios', 'medicos', 'hospitales'];
    if (tiposVaidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida',
            errors: { message: 'Tipo de coleccion no es valida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha seleccionado nada',
            errors: { message: 'Debe de seleccionar un archivo valido' }
        });
    }

    //obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];


    //solo estas extensiones son validas

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha seleccionado una imagen con extension valida',
            errors: { message: 'Las extensiones validas son:' + extensionesValidas.join(', ') }
        });
    }

    //nombre de archivo personalizado

    var nombreArchivo = `${ id }-${new Date().getMilliseconds() }.${extensionArchivo}`;

    //mover el archivo del temporal al path

    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Eroor al mover archivo',
                errors: err
            });
        }


        subirPorTipo(tipo, id, nombreArchivo, res);

    });


});



function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {
            var pathViejo = './uploads/usuarios/' + usuario.img;

            if (!usuario) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al encontrar el usuario requerido',
                    errors: err
                });
            }

            //si existe imagen, eliminala
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar archivo',
                        errors: err
                    });
                }

                usuarioActualizado.password = ':)'

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            })

        });
    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al encontrar el medico requerido',
                    errors: err
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            //eliminar imagen vieja

            if (fs.existsSync(pathViejo)) {
                unlinkSync(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar imagen',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });

            })
        });

    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al encontrar el usuario requerido',
                    errors: err
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            //eliminar la img vieja
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar imagen',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    medico: hospitalActualizado
                });
            })

        });

    }


}

module.exports = app;