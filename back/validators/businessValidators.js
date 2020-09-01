const Joi = require('@hapi/joi');
const { generateError } = require('../helpers');

const newBusinessSchema = Joi.object().keys({
    name: Joi.string().min(3).max(40).required().error(generateError("Este nombre de negocio es incorrecto", 400)),
    category: Joi.string().required().valid('BAR', 'PELUQUERÍA', 'TERRAZA', 'RESTAURANTE', 'RESERVADO').error(generateError("La categoría escogida no está disponible", 400)),
    manager: Joi.string().min(3).max(100).required().error(generateError("Este nombre es incorrecto", 400)),
    telephone: Joi.string().min(5).required().error(generateError("El número de telefóno no es válido", 400)),
    email: Joi.string().email().required().error(generateError("La dirección de email debe ser válida", 400)),
    password: Joi.string().min(8).required().error(generateError("La password debe de tener un mínimo de 8 caracteres", 400)),
    status: Joi.string().valid('SIN_VALIDAR').error(generateError("Sólo el administrador puede cambiar el status del negocio", 400)),
    city: Joi.string().min(3).max(30).required().error(generateError("La provincia no es válida", 400)),

})

const editBusinessSchema = Joi.object().keys({
    header: Joi.any(),
    name: Joi.string().min(3).max(40).required().error(generateError("Este nombre de negocio es incorrecto", 400)),
    category: Joi.string().required().valid('BAR', 'PELUQUERÍA', 'TERRAZA', 'RESTAURANTE', 'RESERVADO').error(generateError("La categoría escogida no está disponible", 400)),
    manager: Joi.string().min(3).max(100).required().error(generateError("Este nombre es incorrecto", 400)),
    email: Joi.string().email().required().error(generateError("La dirección de email debe ser válida", 400)),
    openingTime: Joi.number().integer().min(0).max(23).error(generateError("La hora de apertura debe estar entre 0 y 23", 400)),
    closingTime: Joi.number().integer().min(0).max(23).error(generateError("La hora de cierre debe estar entre 0 y 23", 400)),
    lengthBooking: Joi.number().valid(15, 30, 45, 60, 90, 120, 150, 180).error(generateError("La duración de tu reserva es incorrecta", 400)),
    description: Joi.string().min(20).max(200).error(generateError("La cantidad de caracteres no es válida", 400)),
    bankAccount: Joi.string().min(20).max(30).error(generateError("La cuenta bancaria no es correcta", 400)),
    pricingList: Joi.string(),
    telephone: Joi.string().min(5).required().error(generateError("El número de telefóno no es válido", 400)),
    allotment: Joi.number().integer().min(1).max(500).error(generateError("El cupo establecido no es correcto", 400)),
    allotmentAvailable: Joi.number().integer().min(1).max(500).error(generateError("El cupo establecido no es correcto", 400)),
    profilePicture: Joi.any().error(generateError("La ruta debe ser válida", 400)),
    province: Joi.string().min(3).max(30).error(generateError("La ciudad no es válida", 400)),
    zipCode: Joi.string().min(3).max(10).error(generateError("El código postal debe ser válido", 400)),
    city: Joi.string().min(3).max(30).required().error(generateError("La provincia no es válida", 400)),
    line1: Joi.string().error(generateError("La dirección debe ser válida", 400)),
    line2: Joi.string().error(generateError("La dirección debe ser válida", 400)),
    day1: Joi.number().integer().min(0).max(7).error(generateError("El dia que está abierto es incorrecto", 400)),
    day2: Joi.number().integer().min(0).max(7).error(generateError("El dia que está abierto es incorrecto", 400)),
    day3: Joi.number().integer().min(0).max(7).error(generateError("El dia que está abierto es incorrecto", 400)),
    day4: Joi.number().integer().min(0).max(7).error(generateError("El dia que está abierto es incorrecto", 400)),
    day5: Joi.number().integer().min(0).max(7).error(generateError("El dia que está abierto es incorrecto", 400)),
    day6: Joi.number().integer().min(0).max(7).error(generateError("El dia que está abierto es incorrecto", 400)),
    day7: Joi.number().integer().min(0).max(7).error(generateError("El dia que está abierto es incorrecto", 400)),
})

const loginBusinessSchema = Joi.object().keys({
    email: Joi.string().email().required().error(generateError("La dirección de email debe ser válida", 400)),
    password: Joi.string().min(8).required().error(generateError("La password debe de tener un mínimo de 8 caracteres", 400)),
});

const editBusinessPasswordSchema = Joi.object().keys({
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

const recoverBusinessPasswordSchema = Joi.object().keys({
    email: Joi.string()
        .email()
        .required()
        .error(generateError("El campo email debe contener un email válido", 400)),
});

const resetBusinessPasswordSchema = Joi.object().keys({
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
    newBusinessSchema,
    loginBusinessSchema,
    editBusinessSchema,
    editBusinessPasswordSchema,
    recoverBusinessPasswordSchema,
    resetBusinessPasswordSchema,
};
