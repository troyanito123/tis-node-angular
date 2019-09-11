const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN', 'ESTUDIANTE', 'DOCENTE', 'AUXILIAR'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellido_paterno: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellido_materno: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    role: {
        type: String,
        default: 'ESTUDIANTE',
        enum: rolesValidos
    },
    img: {
        type: String,
        required: false
    },
    estado: {
        type: Boolean,
        default: true
    },
    direccion: {
        type: String,
        required: false
    },
    telefono: {
        type: String,
        required: false
    }
});

usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin( uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('Usuario', usuarioSchema);