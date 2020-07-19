const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");
const { editBusinessPasswordSchema } = require("../../validators/businessValidators")

async function editBusinessPassword(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    await editBusinessPasswordSchema.validateAsync(req.body);

    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (req.auth.id !== Number(id) || req.auth.role !== "admin") {
      throw generateError("No puedes cambiar la password de otro negocio", 403);
    }

    const [currentBusiness] = await connection.query(
      `SELECT id
            FROM business
            WHERE id=? AND password=SHA2(?, 512)
            `,
      [id, oldPassword]
    );

    if (currentBusiness.length === 0) {
      throw generateError("Tu password antigua no es correcta", 401);
    }
    await connection.query(
      `UPDATE business
            SET password=SHA2(?,512), update_date=UTC_TIMESTAMP, last_auth_update=UTC_TIMESTAMP
            WHERE id=?
            `,
      [newPassword, id]
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

module.exports = editBusinessPassword;
