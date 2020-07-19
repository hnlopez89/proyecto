const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");
const { resetUserPasswordSchema } = require("../../validators/userValidators");

async function resetUserPassword(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { recoverCode, newPassword } = req.body;
    await resetUserPasswordSchema.validateAsync(req.body);

    const [current] = await connection.query(
      `SELECT id
            FROM users
            WHERE registration_code=? AND active=true 
            `,
      [recoverCode]
    );

    if (current.length === 0) {
      throw generateError(
        "No hay ningún usuario con este código de recuperación de password",
        404
      );
    }
    console.log(newPassword, recoverCode);

    await connection.query(
      `UPDATE users
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

module.exports = resetUserPassword;
