
const express = require('express');

const Categoria = require('../models/Categoria');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();


/**
 * GET
*/
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
                .sort('descripcion')
                .populate('usuario', 'nombre email')
                .exec((err, categoria) => {
                    if ( err ) {
                        res.status(400).json({
                            ok: false,
                            err
                        });
                        return;
                    }
                    res.json({
                        ok: true,
                        categoria
                    });
                });
});


/**
 * GET ID
*/
app.get('/categoria/:id', verificaToken, (req, res) => {
    const id = req.params.id;
    // return res.json({id});

    Categoria.findById(id)
                .exec((err, categoria) => {
                    if ( err ) {
                        res.status(400).json({
                            ok: false,
                            err
                        });
                        return;
                    }
                    res.json({
                        ok: true,
                        categoria
                    });
                });
});

/**
 * POST
*/
app.post('/categoria', verificaToken, (req, res) => {
    const body  = req.body;
    // return res.json({descripcion})

    const categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaDB) => {
        if ( err ) {
            res.status(400).json({
                ok: false,
                err
            });
            return;
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

/**
 * PUT
*/
app.put('/categoria/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;

    const descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true}, (err, categoriaDB) => {
        if ( err ) {
            res.status(400).json({
                ok: false,
                err
            });
            return;
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

/**
 * DELETE
*/
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;

    Categoria.findByIdAndRemove( id, (err, categoriaDB) => {
        if ( err ) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
            return;
        }
        res.json({
            ok: true,
            err: {
                message: 'Categoria borrada'
            }
        })
    });
});



module.exports = app;
