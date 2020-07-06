const { getConnection } = require("../../db");

async function voteBooking(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { idBooking } = req.params;
    const { rating } = req.body;
    // comprobar que la booking ya fue disfrutada
    const [bookingData] = await connection.query(
      `
    SELECT status, rating
    FROM booking
    WHERE id=?
    `,
      [idBooking]
    );
    const bookingStatus = bookingData[0].status;
    const bookingRating = bookingData[0].rating;

    if (bookingStatus !== "PASADO") {
      const statusError = new Error("Aún no finalizó la reserva");
      statusError.httpStatus = 409;
      throw statusError;
    }
    if (rating < 0 || rating > 5) {
      const ratingError = new Error("La puntuación es errónea");
      ratingError.httpStatus = 409;
      throw ratingError;
    }

    if (bookingRating > 0) {
      const existingRatingError = new Error("La reserva ya está puntuada");
      existingRatingError.httpStatus = 409;
      throw existingRatingError;
    }

    try {
      await connection.query(
        `UPDATE booking
            SET rating=?, update_date=UTC_TIMESTAMP 
            WHERE id=?
            `,
        [rating, idBooking]
      );
    } catch (error) {
      const errorBooking = new Error("No puedes votar la reserva");
      throw errorBooking;
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
