const Joi = require('@hapi/joi');
const { generateError } = require('../helpers');

const now = new Date();

const newBookingSchema = Joi.object().keys({
    checkInTime: Joi.date().min(now).error(generateError("No se puede reservar fechas anteriores a la actual", 400)),
    units: Joi.number().integer().min(1).max(7).required().error(generateError("La cantidad a reservar debe ser entre 1 y 7", 400)),
    creditCardNumber: Joi.string().creditCard().required().error(generateError("La Tarjeta de crédito no es válida")),
    holderName: Joi.string().min(3).max(100).required().error(generateError("Este nombre es incorrecto", 400)),
    expiryDate: Joi.date().min(now).required().error(generateError("La tarjeta ya expiró", 400)),
    cvcCode: Joi.number().integer().min(100).max(999).required().error(generateError("El código de seguridad es incorrecto", 400)),
    status: Joi.string().valid('CONFIRMADO').error(generateError("Sólo el administrador puede cambiar el status de la reserva", 400)),
})

const editUserBookingSchema = Joi.object().keys({
    checkInTime: Joi.date().min(now).error(generateError("No se puede reservar fechas anteriores a la actual", 400)),
    units: Joi.number().integer().min(1).max(7).required().error(generateError("La cantidad a reservar debe ser entre 1 y 7", 400)),
    status: Joi.string().valid('MODIFICADO').error(generateError("Sólo el administrador puede cambiar el status de la reserva", 400)),
})

const editUserBookingTCSchema = Joi.object().keys({
    status: Joi.string().valid('MODIFICADO').error(generateError("Sólo el administrador puede cambiar el status de la reserva", 400)),
    creditCardNumber: Joi.string().creditCard().required().error(generateError("La Tarjeta de crédito no es válida")),
    holderName: Joi.string().min(3).max(100).required().error(generateError("Este nombre es incorrecto", 400)),
    expiryDate: Joi.date().min(now).required().error(generateError("La tarjeta ya expiró", 400)),
    cvcCode: Joi.number().integer().min(100).max(999).required().error(generateError("El código de seguridad es incorrecto", 400)),
})

const voteBookingSchema = Joi.object().keys({
    rating: Joi.number()
        .min(1)
        .max(5)
        .required()
        .error(
            generateError(
                "El campo voto debe existir y tener un valor entre 1 y 5 (incluídos)",
                400
            )
        ),
    ratingDescription: Joi.string().min(2).max(100).error(generateError("La valoración es incorrecta", 400)),
});

module.exports = {
    newBookingSchema,
    editUserBookingSchema,
    editUserBookingTCSchema,
    voteBookingSchema
};
