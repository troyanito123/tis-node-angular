// =====================
//    Verificar token
// =====================

const jwt = require('jsonwebtoken');

let verficaToken = (req, res, next) =>{
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

}

// =====================
//    Verifica AdminRole
// =====================
let verificaAdmin_Role = (req, res, next) =>{
    
    let usuario = req.usuario;

    if(usuario.role === 'ADMIN'){
        next();
    }else{
        res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
}


module.exports = {
    verficaToken,
    verificaAdmin_Role
}