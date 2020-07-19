const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function checkInBooking(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    //obtener id de usuario y de booking de la ruta
    const { idBusiness, idBooking } = req.params;
    //obtener id de usuario y del negocio de la reserva
    //mediante la query en la base de datos
    const [idBookingData] = await connection.query(
      `SELECT id_user, id_business, status
      FROM booking
      WHERE id=?`,
      [idBooking]
    );
    // comprobar que la booking que queremos modificar
    // tiene el mismo id de usuario que el que firma la petición
    const idBusinessBooking = Number(idBookingData[0].id_business);
    if (idBusinessBooking !== Number(idBusiness)) {
      throw generateError(
        "No estas autorizado para modificar reservas de otro usuario",
        404
      );
    }
    //desestructuramos el estado de la reserva
    const statusBooking = idBookingData[0].status;
    console.log(statusBooking);

    if (statusBooking === "CHECK_OUT") {
      throw generateError("Ya has dado de check_out la reserva", 400);
    }
    if (statusBooking === "CANCELADO") {
      throw generateError(
        "No puedes hacer check_in en una reserva cancelada",
        400
      );
    }
    await connection.query(
      `
      UPDATE booking
      SET status = 'CHECK_IN', update_date = UTC_TIMESTAMP
      WHERE id=?;
      `,
      [idBooking]
    );

    res.send({
      status: "ok",
      message: "check in realizado satisfactoriamente!",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = checkInBooking;
