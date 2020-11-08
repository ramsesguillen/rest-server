

const express = require('express');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const Producto = require('../models/Producto');


const app = express();

/**
 * GET
*/
app.get('/producto', verificaToken,(req, res) => {

    Producto.find({})
            .populate('categoria')
            .populate('usuario')
            .exec((err, productoDB) => {
                if ( err ) {
                    res.status(400).json({
                        ok: false,
                        err
                    });
                    return;
                }
                res.json({
                    ok: true,
                    producto: productoDB
                });
            });
});

/**
 * GET
*/
app.get('/producto/:id', verificaToken,(req, res) => {

    const id = req.params.id;

    Producto.findById(id)
            .populate('categoria')
            .populate('usuario')
            .exec((err, productoDB) => {
                if ( err ) {
                    res.status(400).json({
                        ok: false,
                        err
                    });
                    return;
                }
                res.json({
                    ok: true,
                    producto: productoDB
                });
            });
});


/**
 * SEARCHING
*/
app.get('/producto/buscar/:termino', verificaToken,(req, res) => {

    const termino = req.params.termino;
    const regex = new RegExp(termino, 'i')
    Producto.find({ nombre: regex})
            .populate('categoria')
            .populate('usuario')
            .exec((err, productoDB) => {
                if ( err ) {
                    res.status(400).json({
                        ok: false,
                        err
                    });
                    return;
                }
                res.json({
                    ok: true,
                    producto: productoDB
                });
            });
});




/**
 * POST
*/
app.post('/producto', verificaToken, (req, res) => {
    const { nombre, precioUni, descripcion, categoria, disponible } = req.body;
    const usuario = req.usuario._id;

    const producto = new Producto({
        nombre,
        precioUni,
        descripcion,
        disponible,
        categoria,
        usuario
    });

    producto.save((err, productoDB) => {
        if ( err ) {
            res.status(400).json({
                ok: false,
                err
            });
            return;
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

/**
 * PUT
*/
app.put('/producto', (req, res) => {


});

/**
 * DELETE
*/
app.put('/producto', (req, res) => {

});




module.exports = app;