const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const app = express();

app.post('/api/login', (req, res) =>{

    let body = req.body;

    Usuario.findOne({email: body.email}, (error, usuarioDB) =>{
        if(error){
            return res.status(500).json({
                ok: false,
                message: 'No se pudo completar la solicitud',
                error
            });
        }

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                message: 'Email/Contraseña no validas',
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(404).json({
                ok: false,
                message: 'Email/Contraseña no validas',
            });
        }

        let token = jwt.sign({usuario: usuarioDB}, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});
        
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
    
});

module.exports = app;