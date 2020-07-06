const { getConnection } = require("../../db");

async function editBooking(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { idCustomer, idBooking } = req.params;
    const { checkInTime, checkOutTime, frequenzyTime, units } = req.body;
    // comprobar que la booking que queremos modificar
    // tiene el mismo id de usuario que el que firma la petición
    const [customerData] = await connection.query(
      `SELECT id_customer
        FROM booking
        WHERE id=?`,
      [idBooking]
    );
    const [idCustomerData] = customerData;
    if (idCustomerData.id_customer !== Number(idCustomer)) {
      const error = new Error(
        "No estás autorizado para modificar esta reserva"
      );
      error.httpStatus = 404;
      throw error;
    }
    try {
      await connection.query(
        `UPDATE booking
            SET units=?, update_date=UTC_TIMESTAMP 
            WHERE id=?
            `,
        [checkInTime, checkOutTime, frequenzyTime, units, idBooking]
      );
    } catch (error) {
      const errorBooking = new Error("No puedes modificar la reserva");
      throw errorBooking;
    }
    /*
      if (req.auth.id !== Number(id)) {
      const error = new Error("No tienes permisos para editar esta reserva");
      error.httpStatus = 403;
      throw error;*/
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
module.exports = editBooking;
