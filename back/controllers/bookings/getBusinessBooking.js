const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function getBusinessBooking(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { idBusiness, idBooking } = req.params;
    const [result] = await connection.query(
      `
            SELECT B.id,
            check_in_time,
            check_in_day,
            check_out_time,
            check_out_day,
            frequenzy_time,
            B.status,
            units,
            request,
            U.name,
            U.surname,
            U.email,
            U.gender,
            U.birthday,
            U.age,
            U.city
            FROM booking B INNER JOIN users U ON B.id_users = U.id
            WHERE B.id=?
            `,
      [idBooking]
    );
    const idBusinessBooking = result[0].id_business;
    if (idBusinessBooking !== idBusiness) {
      throw generateError(
        "No puedes acceder a la reserva de otro usuario",
        400
      );
    }

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

module.exports = getBusinessBooking;
