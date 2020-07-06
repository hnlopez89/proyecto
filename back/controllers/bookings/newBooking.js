const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");
const { format } = require("date-fns");
const { formatDistanceToNow } = require("date-fns");
const { es } = require("date-fns/locale");

async function newBooking(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { idCustomer, idBusiness } = req.params;
    const {
      checkInTime,
      checkOutTime,
      units,
      creditCardNumber,
      holderName,
      expiryDate,
      cvcCode,
    } = req.body;

    const now = new Date();
    const dateCheckInTime = new Date(checkInTime);
    const dayWeek = format(dateCheckInTime, "i");
    console.log(dayWeek);
    if (
      !idBusiness ||
      !checkInTime ||
      !checkOutTime ||
      !units ||
      !creditCardNumber ||
      !holderName ||
      !expiryDate ||
      !cvcCode ||
      !idCustomer
    ) {
      throw generateError("Faltan datos para realizar la reserva", 400);
    }
    const [openingDaysData] = await connection.query(
      ` SELECT day
        FROM opening_days OD
        WHERE OD.id_business=?
                          `,
      [idBusiness]
    );

    console.log(openingDaysData);

    const isOpen = openingDaysData.find((d) => d.day === dayWeek);
    console.log(isOpen);

    if (isOpen) {
      throw generateError("el negocio no está abierto", 400);
    }
    /*const [openingTimesData, closingTimesData] = await connection.query(
        `SELECT opening_time, closing_time
        FROM business B
            WHERE B.id=?
            `,
      [idBusiness]
    );
    const [openingTimes] = openingTimesData;
    const [closingTimes] = closingTimesData;
    console.log(
      openingTimes.opening_time,
      closingTimes.closing_time,
      closingTimesData[0]
    );*/

    if (dateCheckInTime < now) {
      throw generateError("no puedes reservar fechas pasadas", 400);
    }

    const [result] = await connection.query(
      `
            INSERT INTO booking(check_in_time,
            check_out_time,
            units,
            creating_date,
            update_date,
            credit_card_number,
            holder_name,
            expiry_date,
            cvc_code,
            payment_date,
            id_business,
            id_customer
            )
            VALUES(
                ?, ?, ?, UTC_TIMESTAMP, UTC_TIMESTAMP, ?, ?, ?, ?, UTC_TIMESTAMP, ?, ?
                )
                `,
      [
        checkInTime,
        checkOutTime,
        units,
        creditCardNumber,
        holderName,
        expiryDate,
        cvcCode,
        idBusiness,
        idCustomer,
      ]
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

module.exports = newBooking;
