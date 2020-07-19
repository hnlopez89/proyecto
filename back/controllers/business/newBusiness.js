const { getConnection } = require("../../db");
const { randomString, sendMail } = require("../../helpers");
const { newBusinessSchema } = require("../../validators/businessValidators")

async function newBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    //comprobar que se reciben todos los datos necesarios
    await newBusinessSchema.validateAsync(req.body);
    const { name, manager, category, city, email, password } = req.body;

    if (!name || !manager || !category || !city || !email || !password) {
      const error = new Error(
        "Faltan datos, es necesario indicar un email y una password"
      );
      error.httpStatus = 400;
      throw error;
    }

    // comprobar que no existe un usuario con ese mismo email en la base de datos
    const [existingBusiness] = await connection.query(
      `SELECT id
          FROM business
          WHERE email =?
          `,
      [email]
    );
    if (existingBusiness.length > 0) {
      const error = new Error(
        "Ya existe un usuario en la base de datos con ese email"
      );
      error.httpStatus = 409;
      throw error;
    }
    // enviar un mensaje de confirmación de registro

    const registrationCode = randomString(40);
    const validationURL = `${process.env.PUBLIC_HOST}/user/validation/${registrationCode}`;
    //mirar a ver si se puede enviar un enlace con el nuevo id al admin para que revise.
    try {
      await sendMail({
        email: email,
        title: `Registro en Tempo: ¡Gracias ${name} por querer trabajar con nosotros!`,
        content: `¡Saludos ${manager}!Estás un poco más cerca de empezar a ofrecer tu disponibilidad
                a través de nuestra plataforma. Haz click en el enlace que tienes justo
                debajo para validar tu cuenta.
                De este modo, podrás acceder a tu perfil y editar tu usuario y disponibilidad.
              ${validationURL}`,
      });
    } catch (error) {
      const emailError = new Error("Error en el envío del email");
      throw emailError;
    }
    //meter el nuevo usuario en la base de datos
    await connection.query(
      `INSERT INTO business(name, manager, category, city, email, password, creating_date, update_date, last_auth_update, registration_code)
          VALUES(?, ?, ?, ?, ?, SHA2(?,512), UTC_TIMESTAMP, UTC_TIMESTAMP, UTC_TIMESTAMP, ?)
          `,
      [name, manager, category, city, email, password, registrationCode]
    );
    res.send({
      status: "ok",
      message: `Gracias ${manager} por registrar tu negocio ${name} con nosotros!
      Te hemos mandado un email para validar tu cuenta. Sigue las instrucciones,
      ¡Es super sencillo!
      Un saludo,`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newBusiness;
