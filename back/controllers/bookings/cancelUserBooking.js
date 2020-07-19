const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function cancelUserBooking(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    //EVITAR CANCELACIÓN DE USUARIOS AJENOS A LA RESERVA
    const { idUser, idBooking } = req.params;
    console.log(idUser, req.auth.id);
    if (req.auth.id !== Number(idUser)) {
      throw generateError("No puedes cancelar reservas de otros usuarios", 404);
    }

    //OBTENER EL ESTADO DE LA RESERVA
    const [bookingData] = await connection.query(
      `SELECT status
        FROM booking
        WHERE id=?`,
      [idBooking]
    );
    const bookingStatus = bookingData[0].status;

    //PROHIBIR CANCELAR LA RESERVA SI ESTA DE CHECK-IN, CHECK-OUT O CANCELADA
    if (bookingStatus === "CANCELADO") {
      throw generateError("La reserva ya se canceló previamente", 404);
    }
    if (bookingStatus === "CHECK_IN" || bookingStatus === "CHECK_OUT") {
      throw generateError("La reserva está en uso ó fue usada");
    }
    //CANCELAR RESERVA
    await connection.query(
      `
    UPDATE booking
    SET status = 'CANCELADO', update_date = UTC_TIMESTAMP
    WHERE id=?;
      `,
      [idBooking]
    );
    res.send({
      status: "ok",
      message: "Reserva Cancelada",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = cancelUserBooking;
