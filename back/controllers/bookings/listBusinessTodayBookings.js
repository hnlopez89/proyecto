const { getConnection } = require("../../db");
const {
  formatDateToDB,
  generateError,
} = require("../../helpers");

async function listBusinessTodayBookings(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;

    if (req.auth.id !== Number(id)) {
      throw generateError(
        "No tienes permisos para acceder a las reservas de otro negocio",
        403
      );
    }
    const now = new Date();
    const today = formatDateToDB(now);

    const [result] = await connection.query(
      `SELECT B.id, B.check_in_time, check_in_day, B.check_out_time, B.check_out_day, users.name, users.surname, users.email, B.units, B.status, B.creating_date, B.update_date
            FROM booking B
            INNER JOIN users on B.id_user = users.id
            INNER JOIN business ON B.id_business = business.id
            WHERE B.id_business = ? AND B.check_in_day = ?
            `,
      [id, today]
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

module.exports = listBusinessTodayBookings;
