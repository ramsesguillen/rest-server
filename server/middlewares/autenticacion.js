
const jwt = require('jsonwebtoken');
/**
 * *============================
 * * Verificar Token
 * *============================
*/
const verificaToken = ( req, res, next ) => {
    const token = req.get('token');

    jwt.verify(token, 'este-es-la-semilla-desarrollo', (err, decoded) => {
        if( err ) {
            res.status(401).json({ ok: false, err});
            return;
        }

        req.usuario = decoded.usuario;
        next();
    });

}

/**
 * *============================
 * * Verificar ADMIN ROLE
 * *============================
*/
const verificaAdminRole= ( req, res, next ) => {
    const usuario = req.usuario;

    if ( usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

}

module.exports = {
    verificaToken,
    verificaAdminRole
}
