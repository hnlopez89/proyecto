const { getConnection } = require("../../db");

async function getUserBooking(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { idBooking } = req.params;
    const [result] = await connection.query(
      `
            SELECT B.id,
            U.role,
            check_in_time,
            check_in_day,
            check_out_time,
            check_out_day,
            frequenzy_time,
            B.status,
            units,
            request,
            BU.name,
            BU.category,
            BU.opening_time,
            BU.closing_time,
            BU.profile_picture,
            BU.province,
            BU.city,
            BU.line1,
            BU.line2,
            BU.zip_code,
            BU.email
            FROM booking B INNER JOIN business BU ON B.id_business = BU.id
            INNER JOIN users U ON B.id_user = U.id
            WHERE B.id=?
            `,
      [idBooking]
    );
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

module.exports = getUserBooking;
