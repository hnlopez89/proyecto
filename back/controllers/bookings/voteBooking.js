const { getConnection } = require("../../db");
const { voteBookingSchema } = require("../../validators/bookingsValidators");
const { generateError } = require("../../helpers")

async function voteBooking(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { idUser, idBooking } = req.params;
    const { rating, ratingDescription } = req.body;

    //obtener id de usuario y del negocio de la reserva
    //mediante la query en la base de datos
    const [bookingData] = await connection.query(
      `SELECT id_user, id_business, status, rating
      FROM booking
      WHERE id=?`,
      [idBooking]
    );
    // comprobar que la booking que se quiere votar
    // tiene el mismo id de usuario que el que firma la petición
    const idUserBooking = Number(bookingData[0].id_user);
    if (idUserBooking !== Number(idUser) && req.auth.role !== "admin") {
      throw generateError(
        "No estas autorizado para modificar esta reserva",
        404
      );
    }

    await voteBookingSchema.validateAsync(req.body);

    // comprobar que la booking ya fue disfrutada
    const bookingStatus = bookingData[0].status;
    const bookingRating = bookingData[0].rating;

    if (bookingStatus !== "CHECK_OUT") {
      throw generateError("Aún no finalizó la reserva", 409);
    }
    if (rating < 0 || rating > 5) {
      throw generateError("La puntuación es errónea", 409);
    }
    console.log(bookingRating);
    if (bookingRating > 0) {
      throw generateError("La reserva ya está puntuada", 409);
    }

    try {
      await connection.query(
        `UPDATE booking
        SET rating=?, rating_description=?, update_date=UTC_TIMESTAMP 
        WHERE id=?
            `,
        [rating, ratingDescription, idBooking]
      );
    } catch (error) {
      throw generateError("Hubo un error al votar la reserva", 409);
    }

    res.send({
      status: "ok",
      message: "Reserva valorada satisfactoriamente!.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}
module.exports = voteBooking;
