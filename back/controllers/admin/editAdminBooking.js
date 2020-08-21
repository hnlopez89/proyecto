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
    const { status } = req.body;

    // comprobar que la booking que queremos modificar
    // tiene el mismo id de usuario que el que firma la petición
    if (req.auth.role === "admin") {
      await connection.query(
        `
            UPDATE booking
            SET status = ?, update_date = UTC_TIMESTAMP()
            WHERE id = ? `
        , [status, idBooking]
      );
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
