const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");
const { editUserBookingTCSchema } = require("../../validators/bookingsValidators");


async function editUserBooking(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    //obtener id de usuario y de booking de la ruta
    const { idUser, idBooking } = req.params;


    //obtener id de usuario y del negocio de la reserva
    //mediante la query en la base de datos
    const [bookingData] = await connection.query(
      `SELECT id_user, id_business, status
      FROM booking
      WHERE id=?`,
      [idBooking]
    );
    // comprobar que la booking que queremos modificar
    // tiene el mismo id de usuario que el que firma la petición
    const idUserBooking = Number(bookingData[0].id_user);
    if (idUserBooking !== Number(idUser)) {
      throw generateError(
        "No estas autorizado para modificar esta reserva",
        404
      );
    }

    //SI LA RESERVA NO ESTÁ PENDIENTE DE PAGO, PROHIBIR EDITAR TC
    const statusBooking = bookingData[0].status;
    console.log(statusBooking);

    //obtener todos los datos necesarios para hacer nueva reserva
    const { creditCardNumber, holderName, expiryMonth, expiryYear, cvcCode } = req.body;
    await editUserBookingTCSchema.validateAsync(req.body);
    const idBusinessBooking = bookingData[0].id_business;

    console.log(creditCardNumber, holderName, expiryMonth, expiryYear, cvcCode);
    //prohibir nueva reserva sin los datos necesarios
    if (
      !idBusinessBooking ||
      !creditCardNumber ||
      !holderName ||
      !expiryMonth ||
      !expiryYear ||
      !cvcCode
    ) {
      throw generateError("Faltan datos para modificar la reserva", 400);
    }

    const [bookingUpdate] = await connection.query(
      `UPDATE booking
      SET credit_card_number = SHA2(?,512),
      holder_name = SHA2(?,512),
      expiry_month = SHA2(?,512),
      expiry_year = SHA2(?,512),
      cvc_code = SHA2(?,512)
      WHERE id = ? ;
      `,
      [creditCardNumber, holderName, expiryMonth, expiryYear, cvcCode, idBooking]
    )
    res.send({
      status: "ok",
      data: bookingUpdate,
      message: "Reserva modificada satisfactoriamente!.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editUserBooking;
