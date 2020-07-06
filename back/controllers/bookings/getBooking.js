const { getConnection } = require("../../db");

async function getBooking(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { idBooking } = req.params;
    const [result] = await connection.query(
      `
            SELECT booking.*
            FROM booking
            WHERE booking.id=?
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

module.exports = getBooking;
