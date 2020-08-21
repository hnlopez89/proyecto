const Joi = require('@hapi/joi');
const { generateError } = require('../helpers');
const { subYears } = require('date-fns');

const now = new Date();
const validAge = subYears(now, 18);

const newUserSchema = Joi.object().keys({
    role: Joi.string().invalid("admin"),
    name: Joi.string().min(3).max(20).required().error(generateError("Este nombre es incorrecto", 400)),
    surname: Joi.string().min(3).max(100).required().error(generateError("Este apellido es incorrecto", 400)),
    email: Joi.string().email().required().error(generateError("La dirección de email debe ser válida", 400)),
    password: Joi.string().min(5).required().error(generateError("La password debe de tener un mínimo de 8 caracteres", 400)),
    birthday: Joi.date().max(validAge).required(),
    telephone: Joi.string().min(5).required().error(generateError("El número de telefóno no es válido", 400)),
    gender: Joi.string().valid('VARON', 'MUJER').required(),
    city: Joi.string().min(3).max(30).required().error(generateError("Esta ciudad es incorrecta", 400)),
    active: Joi.string().invalid(true),

});

const loginUserSchema = Joi.object().keys({
    email: Joi.string().email().required().error(generateError("La dirección de email debe ser válida", 400)),
    password: Joi.string().min(5).required().error(generateError("La password debe de tener un mínimo de 8 caracteres", 400)),
});

const editUserSchema = Joi.object().keys({
    role: Joi.string().invalid("admin"),
    name: Joi.string().min(3).max(20).required().error(generateError("Este nombre es incorrecto", 400)),
    surname: Joi.string().min(3).max(100).required().error(generateError("Este apellido es incorrecto", 400)),
    email: Joi.string().email().required().error(generateError("La dirección de email debe ser válida", 400)),
    birthday: Joi.date().max(validAge).required(),
    telephone: Joi.string().min(5).required().error(generateError("El número de telefóno no es válido", 400)),
    gender: Joi.string().valid('VARON', 'MUJER').required(),
    city: Joi.string().min(3).max(30).required().error(generateError("Esta ciudad es incorrecta", 400)),
});

const editUserPasswordSchema = Joi.object().keys({
    oldPassword: Joi.string()
        .min(8)
        .required()
        .error(
            generateError(
                "El campo oldPassword debe existir y ser mayor de 8 caracteres",
                400
            )
        ),
    newPassword: Joi.string()
        .min(8)
        .required()
        .invalid(Joi.ref("oldPassword"))
        .error(
            generateError(
                "El campo newPassword debe existir, ser diferente a oldPassword y ser mayor de 8 caracteres",
                400
            )
        ),
});

const recoverUserPasswordSchema = Joi.object().keys({
    email: Joi.string()
        .email()
        .required()
        .error(generateError("El campo email debe contener un email válido", 400)),
});

const resetUserPasswordSchema = Joi.object().keys({
    recoverCode: Joi.string()
        .length(40)
        .required()
        .error(
            generateError(
                "El campo recoverCode debe existir y tener 40 caracteres",
                400
            )
        ),
    newPassword: Joi.string()
        .min(8)
        .required()
        .error(
            generateError(
                "El campo newPassword debe existir, y ser mayor de 8 caracteres",
                400
            )
        ),
});



module.exports = {
    newUserSchema,
    loginUserSchema,
    editUserSchema,
    editUserPasswordSchema,
    recoverUserPasswordSchema,
    resetUserPasswordSchema,
};
