const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function editUserPassword(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (req.auth.id !== Number(id) && req.auth.role !== "admin") {
      throw generateError("No puedes cambiar la password de otro usuario", 403);
    }

    const [currentUser] = await connection.query(
      `SELECT id
            FROM users
            WHERE id=? AND password=SHA2(?, 512)
            `,
      [id, oldPassword]
    );
    if (currentUser.length === 0) {
      throw generateError("Tu password antigua no es correcta", 401);
    }
    await connection.query(
      `UPDATE users
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

module.exports = editUserPassword;
