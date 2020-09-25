const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");
const { resetBusinessPasswordSchema } = require("../../validators/businessValidators")


async function resetBusinessPassword(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    await resetBusinessPasswordSchema.validateAsync(req.body);

    const { recoverCode, newPassword } = req.body;

    console.log(newPassword, recoverCode);
    const [current] = await connection.query(
      `SELECT id
            FROM business
            WHERE registration_code=? AND (status='OPERATIVO' OR status='PENDIENTE') 
            `,
      [recoverCode]
    );

    if (current.length === 0) {
      throw generateError(
        "No hay ningún usuario con este código de recuperación de password",
        404
      );
    }

    await connection.query(
      `UPDATE business
        SET password=SHA2(?,512), registration_code=NULL, update_date=UTC_TIMESTAMP, last_auth_update=UTC_TIMESTAMP
        WHERE registration_code=?`,
      [newPassword, recoverCode]
    );
    res.send({
      status: "ok",
      message: "Password actualizada",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = resetBusinessPassword;
