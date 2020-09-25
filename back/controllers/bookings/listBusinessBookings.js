const { getConnection } = require("../../db");

async function listBusinessBookings(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;

    if (req.auth.id !== Number(id)) {
      const error = new Error(
        "No tienes permisos para acceder a las reservas de otro negocio"
      );
      error.httpStatus = 403;
      throw error;
    }

    const [result] = await connection.query(
      `SELECT B.check_in_time, B.check_out_time, users.name, users.surname, users.email, B.units, B.status, B.creating_date, B.update_date
            FROM booking B
            INNER JOIN users on B.id_user = users.id
            INNER JOIN business ON B.id_business = business.id
            WHERE B.id_business = ?
            AND B.status = 'CONFIRMADO' OR B.status = 'MODIFICADO' OR B.status = 'PENDIENTE_DE_PAGO' ;
            ORDER BY B.check_in_time DESC
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

module.exports = listBusinessBookings;
