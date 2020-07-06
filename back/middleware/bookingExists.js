const { getConnection } = require("../db");
const { generateError } = require("../helpers");

async function bookingExists(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { idBooking } = req.params;

    //comprobar que la reserva que queremos editar
    //exista en la base de datos
    const [current] = await connection.query(
      `
            SELECT id
            FROM booking
            WHERE id=?
            `,
      [idBooking]
    );
    if (current.length === 0) {
      throw generateError(
        `La entrada con id${idBooking} no existe en la base de datos`,
        404
      );
    } else {
      next();
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = bookingExists;
