const { getConnection } = require("../../db");
const { randomString, sendMail, generateError } = require("../../helpers");
const { recoverUserPasswordSchema } = require("../../validators/userValidators");


async function recoverUserPassword(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    await recoverUserPasswordSchema.validateAsync(req.body);
    const { email } = req.body;
    const [current] = await connection.query(
      `SELECT id
            FROM users
            WHERE email=?
            `,
      [email]
    );
    if (current.length === 0) {
      throw generateError(
        `No hay ningún usuario con email ${email} en la base de datos`,
        404
      );
    }

    const recoverCode = randomString(40);

    await connection.query(
      `UPDATE users
        SET registration_code=?
        WHERE email=?`,
      [recoverCode, email]
    );

    try {
      await sendMail({
        email: email,
        title: "Reset de tu password",
        content: `Alguien solicitó una recuperación de tu contraseña, este es el código que tienes que usar: ${recoverCode}.
                Para resetear tu contraseña dirigete a este enlace e inserta el código que te acabamos de proporcionar: ${process.env.FRONTEND_URL}/user/reset-password .
                
                Si no fuiste tu quien solicitó esta recuperación, ignora este email.`,
      });
    } catch (error) {
      throw generateError("Error de envío de mail", 500);
    }

    res.send({
      status: "ok",
      message:
        "Se envió un email a la cuenta asociada con el usuario un email con instrucciones",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = recoverUserPassword;
