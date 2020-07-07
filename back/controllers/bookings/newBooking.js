const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");
const { format } = require("date-fns");

async function newBooking(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { idUser, idBusiness } = req.params;
    const {
      checkInTime,
      checkOutTime,
      units,
      creditCardNumber,
      holderName,
      expiryDate,
      cvcCode,
    } = req.body;
    if (req.auth.id !== Number(idUser)) {
      throw generateError("No estás autorizado", 401);
    }

    const now = new Date();
    const dateCheckInTime = new Date(checkInTime);
    const dayWeek = format(dateCheckInTime, "i");

    if (
      !idBusiness ||
      !checkInTime ||
      !checkOutTime ||
      !units ||
      !creditCardNumber ||
      !holderName ||
      !expiryDate ||
      !cvcCode ||
      !idUser
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

    const isOpen = openingDaysData.find((d) => d.day === Number(dayWeek));
    console.log(isOpen);

    if (!isOpen) {
      throw generateError("el negocio no está abierto", 400);
    }
    const dateCheckOutTime = new Date(checkOutTime);
    const hourCheckInTime = format(dateCheckInTime, "k");
    const hourCheckOutTime = format(dateCheckOutTime, "k");
    const [scheduleTimesData] = await connection.query(
      `SELECT opening_time, closing_time
        FROM business B
        WHERE B.id=?
        `,
      [idBusiness]
    );
    const openingTime = scheduleTimesData[0].opening_time;
    const closingTime = scheduleTimesData[0].closing_time;

    console.log(
      Number(openingTime),
      Number(hourCheckInTime),
      Number(closingTime),
      Number(hourCheckOutTime)
    );
    if (
      Number(hourCheckInTime) < Number(openingTime) ||
      Number(hourCheckOutTime) > Number(closingTime)
    ) {
      throw generateError("El negocio no está abierto a esa hora", 401);
    }

    if (dateCheckInTime < now) {
      throw generateError("no puedes reservar fechas pasadas", 400);
    }
    const [allotmentAvailableData] = await connection.query(
      `SELECT B.allotment
        FROM business B, opening_days OD
        WHERE B.id=?
                AND ? BETWEEN B.opening_time AND B.closing_time
        `,
      [idBusiness, dayWeek, openingTime]
    );

    console.log(allotmentAvailableData, idBusiness, dayWeek, openingTime);

    await connection.query(
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
            id_user
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
        idUser,
      ]
    );
    res.send({
      status: "ok",
      data: checkInTime,
      hora: checkOutTime,
      unidades: units,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newBooking;
