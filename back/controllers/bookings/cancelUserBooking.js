const { getConnection } = require("../../db");
const { generateError, sendMail } = require("../../helpers");

async function cancelUserBooking(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    //EVITAR CANCELACIÓN DE USUARIOS AJENOS A LA RESERVA
    const { idUser, idBooking } = req.params;
    if (req.auth.id !== Number(idUser)) {
      throw generateError("No puedes cancelar reservas de otros usuarios", 404);
    }
    //OBTENER EL ESTADO DE LA RESERVA Y LA DIRECCIÓN DE EMAIL DEL NEGOCIO
    const [bookingData] = await connection.query(
      `SELECT booking.status, business.email, business.name, booking.check_in_time
        FROM booking INNER JOIN business ON business.id = booking.id_business
        WHERE booking.id=?`,
      [idBooking]
    );
    const bookingStatus = bookingData[0].status;
    const businessEmail = bookingData[0].email;
    const businessName = bookingData[0].name;
    const checkInTime = bookingData[0].checkInTime;

    //OBTENER LA DIRECCIÓN DE EMAIL DEL USUARIO
    const [userData] = await connection.query(
      `SELECT email, name
      FROM users
      WHERE id=?`,
      [idUser]
    );

    const userEmail = userData[0].email;
    const userName = userData[0].name;

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
    try {
      await sendMail({
        email: userEmail,
        title: `Has cancelado la reserva ${idBooking} en ${businessName} exitosamente`,
        content: `Te informamos de que has cancelado satisfactoriamente tu reserva con el 
        id ${idBooking} en el establecimiento ${businessName}. Esperamos que estés bien,
        y que vuelvas a reservar con nosotros.
        Un saludo del equipo de Tempo`,
      });
    } catch (error) {
      throw generateError("Error en el envío del email", 405);
    }

    try {
      await sendMail({
        email: businessEmail,
        title: `Cancelación de la reserva ${idBooking} con entrada ${checkInTime}`,
        content: `Te informamos de que tu cliente ${userName} ha cancelado su reserva con el 
        id ${idBooking} que estaba prevista para la fecha ${checkInTime}.
        Un saludo del equipo de Tempo`,
      });
    } catch (error) {
      throw generateError("Error en el envío del email", 405);
    }
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
