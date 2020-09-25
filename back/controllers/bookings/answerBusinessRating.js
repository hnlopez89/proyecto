const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function answerBusinessRating(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    //obtener id de usuario y de booking de la ruta
    const { idBusiness, idBooking } = req.params;
    const { ratingAnswer } = req.body;

    //obtener id de usuario y del negocio de la reserva
    //mediante la query en la base de datos
    const [bookingData] = await connection.query(
      `SELECT id_user, id_business, status, rating, rating_answer
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

    //ESTADOS DE RESERVA QUE EVITAN LA RESPUESTA EN LA RESERVA
    const statusBooking = bookingData[0].status;
    if (
      statusBooking !== "CHECK_OUT"
    ) {
      throw generateError(
        "No puedes responder opiniones de reservas que no han hecho check_out",
        400
      );
    }

    //OBLIGATORIEDAD DE EXISTIR PUNTUACIÓN PARA LA RESPUESTA EN LA RESERVA
    const bookingRating = bookingData[0].rating;
    if (!bookingRating) {
      throw generateError(
        "No puedes responder opiniones de reservas que no han sido puntuadas",
        400
      );
    }


    //OBLIGATORIEDAD DE EXISTIR PUNTUACIÓN PARA LA RESPUESTA EN LA RESERVA
    const bookingRatingAnswer = bookingData[0].rating_answer;
    if (bookingRatingAnswer) {
      throw generateError(
        "No puedes volver a responder opiniones de reservas",
        400
      );
    }


    await connection.query(
      `
      UPDATE booking
      SET rating_answer = ?, update_date = UTC_TIMESTAMP
      WHERE id=?;
      `,
      [ratingAnswer, idBooking]
    );

    res.send({
      status: "ok",
      message: "Has respondido a la puntuación satisfactoriamente",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = answerBusinessRating;
