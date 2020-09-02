const { getConnection } = require("../db");
const { generateError, sendMail } = require("../helpers");

async function sendContactMail(req, res, next) {
    let connection;
    try {
        connection = await getConnection();
        const { emailAddress, subject, text } = req.body;

        if (!emailAddress || !subject || !text) {
            throw generateError("Faltan datos por rellenar")
        }
        try {
            await sendMail({
                email: "hnlopez89@gmail.com",
                title: `${emailAddress} quiere tratarte sobre el asunto: ${subject}`,
                content: `Esta es lo que han escrito "${text}"`,
            });
        } catch (error) {
            throw generateError("Error en el envío del email", 400);
        }
        try {
            await sendMail({
                email: `${emailAddress}`,
                title: ` Hemos recibido tu email con el asunto: ${subject}`,
                content: `Gracias por habernos escrito. Nuestro personal te contactará en las próximas 48 horas
                                        en relación al email de${text}`,
            });
        } catch (error) {
            throw generateError("Error en el envío del email", 400);
        }
        res.send({
            status: "ok",
            message: `Gracias por haber contactado con nosotros. ¡Te contactaremos enseguida!`,
        });

    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
}

module.exports = sendContactMail;
