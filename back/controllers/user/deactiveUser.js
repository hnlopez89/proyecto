const { getConnection } = require("../../db");

const { sendMail, generateError } = require("../../helpers");
async function deactiveUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;

    // PROHIBIR DESACTIVAR CUENTA AJENA
    if (req.auth.id !== Number(id) || req.auth.role !== "admin") {
      throw generateError(
        "No puedes desactivar la cuenta de un usuario que no es el tuyo",
        404
      );
    }

    //VERIFICAR QUE EL USUARIO NO TIENE NINGUNA RESERVA ACTIVA
    const [bookingStatusUser] = await connection.query(
      `
      SELECT B.id_user, B.status
      FROM booking B
      WHERE B.id_user=?
      `,
      [id]
    )

    const confirmed = 'CONFIRMADO';
    const isConfirmed = bookingStatusUser.find(data => data.status === confirmed)

    const pending = 'PENDIENTE_DE_PAGO';
    const isPending = bookingStatusUser.find(data => data.status === pending)

    const modified = 'MODIFICADO';
    const isModified = bookingStatusUser.find(data => data.status === modified)

    if (isModified || isPending || isConfirmed) {
      throw generateError("No puedes desactivar tu cuenta porque todavía tienes reservas activas", 404)
    } //PROCEDER CON LA DESACTIVACIÓN DEL PERFIL
    else {
      const [deactiveAccount] = await connection.query(
        `SELECT name, email
        FROM users 
        WHERE id=?
        `,
        [req.auth.id]
      );
      const deactiveEmail = deactiveAccount[0].email;
      const deactiveName = deactiveAccount[0].name;
      console.log(deactiveEmail, deactiveName);
      //ENVIAR EMAIL CON LO QUÉ HA SUCEDIDO
      try {
        await sendMail({
          deactiveEmail,
          title: "Desactivación de tu cuenta en Tempo",
          content: `Lamentamos ${deactiveName} que quieras darte de baja en nuestra aplicación.
          Gracias por haber utilizado nuestra plataforma, esperamos volver a verte pronto!`,
        });
      } catch (error) {
        throw generateError("Error al enviar el email");
      }
      await connection.query(
        `UPDATE users
        SET active=false
        WHERE id=?`,
        [req.auth.id]
      );
    }
    res.send({
      status: "ok",
      message: "Usuario dado de baja satisfactoriamente (es mentira muajaja)",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deactiveUser;
