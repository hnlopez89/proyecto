const { getConnection } = require("../../db");

async function listBookings(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;

    if (req.auth.id !== Number(id)) {
      const error = new Error("No tienes permisos para editar ete usuario");
      error.httpStatus = 403;
      throw error;
    }
    const [result] = await connection.query(
      `SELECT booking.check_in_time, booking.check_out_time, booking.status, business.name, business.category, business.city
            FROM booking 
            INNER JOIN business ON booking.id_business = business.id
            INNER JOIN user ON booking.id_user = user.id
            WHERE user.id = ?
            `,
      [id]
    );

    // mando la respuesta
    res.send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = listBookings;
