const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function noShowBooking(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    //obtener id de usuario y de booking de la ruta
    const { idBusiness, idBooking } = req.params;

    //obtener id de usuario y del negocio de la reserva
    //mediante la query en la base de datos
    const [bookingData] = await connection.query(
      `SELECT id_user, id_business, status, check_in_day
      FROM booking
      WHERE id=?`,
      [idBooking]
    );
    // comprobar que la booking que queremos modificar
    // tiene el mismo id de usuario que el que firma la petición
    const idBusinessBooking = Number(bookingData[0].id_business);
    if (idBusinessBooking !== Number(idBusiness)) {
      throw generateError(
        "No estas autorizado para modificar reservas de otro negocio",
        404
      );
    }
    //NO SHOW SOLO DURANTE EL DIA DE RESERVA
    const checkInDayData = bookingData[0].check_in_day;
    const checkInDay = new Date(checkInDayData).getDate();

    const today = new Date().getDate();
    console.log(checkInDay, today);

    if (checkInDay !== today) {
      throw generateError(
        "La reserva seleccionada no está programada para hoy",
        404
      );
    }

    //ESTADOS DE RESERVA QUE EVITAN EL CAMBIO DE ESTADO EN LA RESERVA
    const statusBooking = bookingData[0].status;
    if (
      statusBooking === "CHECK_OUT" ||
      statusBooking === "CHECK_IN" ||
      statusBooking === "NO_SHOW"
    ) {
      throw generateError(
        "No puedes modificar el estado de la reserva que previamente has actualizado",
        400
      );
    }

    if (statusBooking === "CANCELADO") {
      throw generateError("No puedes modificar una reserva cancelada", 400);
    }

    await connection.query(
      `
      UPDATE booking
      SET status = 'NO_SHOW', update_date = UTC_TIMESTAMP
      WHERE id=?;
      `,
      [idBooking]
    );

    res.send({
      status: "ok",
      message: "La reserva no se utilizó finalmente",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = noShowBooking;
