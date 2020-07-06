const { getConnection } = require("../../db");

async function validateBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { registrationCode } = req.params;

    //comprobamos que el código de registro es el correcto
    const [result] = await connection.query(
      `
            SELECT email
            FROM business
            WHERE registration_code=?
            `,
      [registrationCode]
    );

    if (result.length === 0) {
      const error = new Error(
        "No hay ningún usuario pendiente de validación con ese código"
      );
      error.httpStatus = 404;
      throw error;
    }

    //actualizar la tabla de usuarios marcando como activo
    //el usuario que tenga el código recibido
    await connection.query(
      `UPDATE business
            SET status="OPERATIVO", registration_code=NULL
            WHERE registration_code=?
            `,
      [registrationCode]
    );
    res.send({
      status: "ok",
      message: `Ya puedes hacer login con tu email: ${result[0].email} y tu contraseña`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = validateBusiness;
