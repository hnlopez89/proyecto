const { getConnection } = require("../../db");

const { sendMail, generateError } = require("../../helpers");
async function deactiveBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;
    if (req.auth.id !== Number(id) || req.auth.role !== "admin") {
      throw generateError(
        "No puedes desactivar la cuenta de otro negocio que no es el tuyo",
        404
      );
    }
    //VERIFICAR QUE EL NEGOCIO NO TIENE NINGUNA RESERVA ACTIVA
    const [bookingStatusBusiness] = await connection.query(
      `
      SELECT B.id_business, B.status
      FROM booking B
      WHERE B.id_business=?
      `,
      [id]
    )

    const confirmed = 'CONFIRMADO';
    const isConfirmed = bookingStatusBusiness.find(data => data.status === confirmed)

    const pending = 'PENDIENTE_DE_PAGO';
    const isPending = bookingStatusBusiness.find(data => data.status === pending)

    const modified = 'MODIFICADO';
    const isModified = bookingStatusBusiness.find(data => data.status === modified)

    if (isModified || isPending || isConfirmed) {
      throw generateError(
        "No puedes desactivar tu cuenta porque todavía tienes reservas activas. Asegurate de no ofrecer disponibilidad para no seguir recibiendo reservas", 404)
    }
    else {
      const [deactiveAccount] = await connection.query(
        `SELECT manager, email
        FROM business
        WHERE id=?
        `,
        [req.auth.id]
      );
      const deactiveEmail = deactiveAccount[0].email;
      const deactiveManager = deactiveAccount[0].name;
      console.log(deactiveEmail, deactiveManager);

      try {
        await sendMail({
          deactiveEmail,
          title: "Desactivación de tu cuenta en Tempo",
          content: `Lamentamos ${deactiveManager} que quieras darte de baja en nuestra aplicación, vas a dejar de recibir reservas :(
                    Gracias por haber utilizado nuestra plataforma, esperamos volver a verte pronto!`,
        });
      } catch (error) {
        throw generateError("Error al enviar el email");
      }
      await connection.query(
        `UPDATE business
                SET status= 'CERRADO'
                WHERE id=?`,
        [req.auth.id]
      );
    }
    res.send({
      status: "ok",
      message: "Negocio dado de baja satisfactoriamente (es mentira muajaja)",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deactiveBusiness;
