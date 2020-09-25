const { getConnection } = require("../../db");
const {
  generateError,
} = require("../../helpers");

async function editAdminBooking(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    //obtener id de usuario y de booking de la ruta
    const { idBooking } = req.params;
    const { status, ratingDescription, ratingAnswer } = req.body;

    // comprobar que la booking que queremos modificar
    // tiene el mismo id de usuario que el que firma la petición
    if (req.auth.role === "admin") {
      if (status) {

        await connection.query(
          `
          UPDATE booking
          SET status = ?, update_date = UTC_TIMESTAMP()
          WHERE id = ? `
          , [status, idBooking]
        );
      }
      else if (ratingDescription && ratingAnswer) {
        console.log(ratingDescription, ratingAnswer);
        await connection.query(
          `
          UPDATE booking
          SET rating_description=?, rating_answer=?, update_date = UTC_TIMESTAMP()
          WHERE id = ? `
          , [ratingDescription, ratingAnswer, idBooking]
        );
      }
      else if (ratingDescription) {
        await connection.query(
          `
          UPDATE booking
          SET rating_description=?, update_date = UTC_TIMESTAMP()
          WHERE id = ? `
          , [ratingDescription, idBooking]
        );
      }
    } else {
      throw generateError(
        "No eres administrador por lo que no puedes hacer determinadas modificaciones",
        404
      );
    }
    res.send({
      status: "ok",
      message: "Reserva modificada satisfactoriamente!.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editAdminBooking;
