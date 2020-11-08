const express = require('express');
// impoert del modelo usuario
const Usuario = require('../models/Usuario');
// dependencia para incriptar password
const bcrypt = require('bcrypt');
// Generar tokens
const jwt = require('jsonwebtoken');


const app = express();


app.post('/login', (req, res) => {

    const { email, password } = req.body;

    Usuario.findOne({ email }, (err, usuarioDB) => {
        if ( err ) {
            res.status(500).json({
                ok: false,
                err
            });
            return;
        }
        if ( !usuarioDB ) {
            res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrecto'
                }
            });
            return;
        }
        if ( !bcrypt.compareSync( password, usuarioDB.password ) ) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrecto'
                }
            });
            return;
        }

        const token = jwt.sign({
            usuario: usuarioDB
          }, 'este-es-la-semilla-desarrollo', { expiresIn: 60 * 60 * 24 * 30});

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        });
    });
});







module.exports = app;