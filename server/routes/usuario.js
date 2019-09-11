const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');

const { verficaToken } = require('../middlewares/autenticacion');

const app = express();

// app.post('/api/usuario', (req, res) => {
//     let body = req.body;

//     let usuario = new Usuario({
//         nombre: body.nombre,
//         apellido_paterno: body.apellido_paterno,
//         apellido_materno: body.apellido_materno,
//         email: body.email,
//         password: bcrypt.hashSync(body.password, 10),
//         role: body.role
//     });

//     usuario.save( (error, usuarioDB) => {
//         if(error){
//             return res.status(400).json({
//                 ok: false,
//                 message: 'No se pudo guardar el usuario',
//                 error
//             });
//         }

//         res.json({
//             ok: true,
//             usuario: usuarioDB
//         });
//     });
// });


app.get('/api/usuario', verficaToken, (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});

app.post('/api/usuario', (req, res) =>{

    let token = req.get('token')

    if(token){
        let esValido = tokenValido(token);
        if(esValido.ok){
            let roleUsuario = esValido.usuario.role;
            if(roleUsuario === 'ADMIN'){
                // crear usuario con el rol que me mandan
                let body = req.body;

                let usuario = new Usuario({
                    nombre: body.nombre,
                    apellido_paterno: body.apellido_paterno,
                    apellido_materno: body.apellido_materno,
                    email: body.email,
                    password: bcrypt.hashSync(body.password, 10),
                    role: body.role
                });

                usuario.save( (error, usuarioDB) => {
                    if(error){
                        return res.status(400).json({
                            ok: false,
                            message: 'No se pudo guardar el usuario',
                            error
                        });
                    }

                    res.json({
                        ok: true,
                        role: body.role,
                        usuario: usuarioDB
                    });
                });
            }else{
                // no crear nada...
                return res.status(401).json({
                    ok: false,
                    message: 'El token proporcionado no es de tipo administrador'
                });
            }
        }else{
            return res.status(401).json({
                ok: false,
                message: 'token no valido'
            });
        }        
    }else{
        // crear estudiante
        let body = req.body;

        let usuario = new Usuario({
            nombre: body.nombre,
            apellido_paterno: body.apellido_paterno,
            apellido_materno: body.apellido_materno,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: 'ESTUDIANTE'
        });

        usuario.save( (error, usuarioDB) => {
            if(error){
                return res.status(400).json({
                    ok: false,
                    message: 'No se pudo guardar el usuario',
                    error
                });
            }

            res.json({
                ok: true,
                role: 'ESTUDIANTE',
                usuario: usuarioDB
            });
        });
    }
    

    
});

app.post('/token', (req, res) => {
    let token = req.get('token');
    let respuesta = tokenValido(token);

    res.json({
        token,
        respuesta
    });
});

let tokenValido = function(token) {
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err){
            return respuesta = {
                ok: false,
            };
        }
        respuesta = {
            ok: true,
            usuario: decoded.usuario
        };
    });
    return respuesta;
}


    
//exportar
module.exports = app;