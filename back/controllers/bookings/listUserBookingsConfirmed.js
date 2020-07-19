const { getConnection } = require("../../db");

async function listUserBookings(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;

    if (req.auth.id !== Number(id) || req.auth.role !== "admin") {
      const error = new Error("No tienes permisos para acceder a este usuario");
      error.httpStatus = 403;
      throw error;
    }
    const [result] = await connection.query(
      `SELECT booking.id, booking.check_in_time, booking.check_out_time, booking.status, business.name, business.category, business.city
            FROM booking 
            INNER JOIN business ON booking.id_business = business.id
            INNER JOIN users ON booking.id_user = users.id
            WHERE users.id = ? AND booking.status = 'CONFIRMADO'
            OR booking.status = 'MODIFICADO' OR booking.status = 'PENDIENTE DE PAGO'
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

module.exports = listUserBookings;
