const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function checkOutBooking(req, res, next) {
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
    //PERMITIR CAMBIAR EL ESTADO DE LA RESERVA SÓLO SI HA HECHO CHECK_IN
    const statusBooking = idBookingData[0].status;
    if (statusBooking !== "CHECK_IN") {
      throw generateError(
        "Tienes que hacer primero check_in en la reserva",
        400
      );
    }
    await connection.query(
      `
      UPDATE booking
      SET status = 'CHECK_OUT', update_date = UTC_TIMESTAMP
      WHERE id=?;
      `,
      [idBooking]
    );

    res.send({
      status: "ok",
      message: "check out realizado satisfactoriamente!",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = checkOutBooking;
