const { getConnection } = require("../../db");
const { randomString, sendMail } = require("../../helpers");

async function newCustomer(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { name, surname, email, password } = req.body;

    // comprobar que se reciben todos los datos necesarios
    if (!email || !password) {
      const error = new Error(
        "Faltan datos, es necesario especificar un email y una password"
      );
      error.httpStatus = 400;
      throw error;
    }

    //comprobar que no existe un usuario con ese mismo email en la base de datos
    const [existingUser] = await connection.query(
      `
            SELECT id
            FROM customers
            WHERE email =?
            `,
      [email]
    );
    if (existingUser.length > 0) {
      const error = new Error(
        "Ya existe un usuario en la base de datos con ese email"
      );
      error.httpStatus = 409;
      throw error;
    }
    // enviar un mensaje de confirmación de registro al email indicador

    const registrationCode = randomString(40);
    const validationURL = `${process.env.PUBLIC_HOST}/customer/validation/${registrationCode}`;

    //Enviamos la url anterior por mail
    try {
      await sendMail({
        email,
        title: "Valida tu cuenta de usuario en la app Tempo",
        content: `Para validar tu cuenta de usuario en la app haz click aquí: ${validationURL}`,
      });
    } catch (error) {
      const emailError = new Error("Error en el envío de mail");
      throw emailError;
    }
    // meter el nuevo usuario en la base de datos sin activar

    await connection.query(
      `INSERT INTO customers(name, surname, email, password, creating_date, update_date, last_auth_update, registration_code )
      VALUES(?, ?, ?, SHA2(?,512), UTC_TIMESTAMP(), UTC_TIMESTAMP(), UTC_TIMESTAMP(), ? )
            `,
      [name, surname, email, password, registrationCode]
    );
    res.send({
      status: "ok",
      message:
        "Usuario registrado. Mira tu email para activarlo. Mira en la carpeta de SPAM si no lo encuentras",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newCustomer;
