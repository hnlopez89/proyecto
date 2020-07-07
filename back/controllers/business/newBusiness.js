const { getConnection } = require("../../db");
const { randomString, sendMail } = require("../../helpers");

async function newBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { name, manager, category, city, email, password } = req.body;
    //comprobar que se reciben todos los datos necesarios

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
        email: "hnlopez89@gmail.com",
        title: `El negocio ${name} quiere trabajar contigo`,
        content: `Enhorabuena,
              un nuevo negocio quiere trabajar contigo. Revisa sus datos
              para verificar que todo está correcto y dalo de alta.
              Cuando esté todo ok, puedes activar el negocio en el siguiente enlace:
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
      message: `Gracias ${manager} por registrarte con nosotros. En breve contactaremos contigo para actualizar tu disponibilidad y activar tu cuenta.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newBusiness;
