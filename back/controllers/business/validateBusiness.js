const { getConnection } = require("../../db");
const { generateError, sendMail } = require("../../helpers");

async function validateBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { registrationCode } = req.params;

    //Comprobamos que el código de registro es el correcto
    const [result] = await connection.query(
      `
            SELECT email, name, manager, status
            FROM business
            WHERE registration_code=?
            `,
      [registrationCode]
    );
    const name = result[0].name;
    const manager = result[0].manager;
    const status = result[0].status;

    if (result.length === 0) {
      const error = new Error(
        "No hay ningún usuario pendiente de validación con ese código"
      );
      error.httpStatus = 404;
      throw error;
    }

    if (status !== "SIN_VALIDAR") {
      throw generateError("Tu negocio no está pendiente de validación");
    }

    //actualizar la tabla de usuarios marcando como activo
    //el usuario que tenga el código recibido
    await connection.query(
      `UPDATE business
            SET status='PENDIENTE', registration_code=NULL, update_date=UTC_TIMESTAMP, last_auth_update=UTC_TIMESTAMP
            WHERE registration_code=?
            `,
      [registrationCode]
    );
    try {
      await sendMail({
        email: "esehugo@hotmail.com",
        title: `El negocio ${name} quiere trabajar contigo`,
        content: `Enhorabuena,
              un nuevo negocio quiere trabajar contigo. Accede a tu perfil y
              revisa sus datos para verificar que todo está correcto y dalo de alta.
              ¡Aprovecha para darle una calurosa bienvenida a ${manager}!`,
      });
    } catch (error) {
      throw generateError("Error en el envío del email", 400);
    }

    res.send({
      status: "ok",
      message: `Ya puedes hacer login con tu email: ${result[0].email} y tu contraseña. ¡Bienvenido!`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = validateBusiness;
