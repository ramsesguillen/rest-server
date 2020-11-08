const express = require('express');
// dependencia para incriptar password
const bcrypt = require('bcrypt');
// funciones especiales
const _ = require('underscore');
// impoert del modelo usuario
const Usuario = require('../models/Usuario');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();


/**
 * GET
*/
app.get('/usuario', verificaToken, (req, res) => {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;

    Usuario.find({ estado: true}, 'nombre email role estado google')
            .skip( desde )
            .limit( limite )
            .exec((err, usuario) => {
                if ( err ) {
                    res.status(400).json({
                        ok: false,
                        err
                    });
                    return;
                }
                Usuario.countDocuments({estado: true}, (err, conteo) => {
                    res.json({
                        ok:true,
                        usuario,
                        registros: conteo
                    });
                });
            });
});

/**
 * POST
*/
app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
    //* Get del request
    const {nombre, email, password, role } = req.body;

    //* Set del request al schema
    const usuario = new Usuario({
        nombre,
        email,
        password: bcrypt.hashSync(password, 10),
        role
    });
    //* Insert data a la DB y retorn una respuesta al cliente
    usuario.save( (err, usuarioDB) => {
        if ( err ) {
            res.status(400).json({
                ok: false,
                err
            });
            return;
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

/**
 * PUT
*/
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;
    // pick - filtra los elementos en el objeto
    const body = _.pick( req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true,  runValidators: true }, (err, usuarioDB) => {
        if ( err ) {
            res.status(400).json({
                ok: false,
                err
            });
            return;
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

/**
 * DELETE
*/
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    const id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if ( err ) {
            res.status(400).json({
                ok: false,
                err
            });
            return;
        }
        if ( usuarioBorrado === null) {
            res.status(400).json({
                ok: false,
                err: "Usuario no encontrado"
            });
            return;
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

app.delete('/user/:id', function (req, res) {
    const id = req.params.id;

    const cambiaEstado = { estado: false };

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioDB) => {
        if ( err ) {
            res.status(400).json({
                ok: false,
                err
            });
            return;
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

module.exports = app;
