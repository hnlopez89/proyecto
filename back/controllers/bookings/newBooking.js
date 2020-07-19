const { getConnection } = require("../../db");
const {
  generateError,
  formatDateToDB,
  formatDateTimeToDB,
  sendMail,
  minutesToDB
} = require("../../helpers");
const { format, addMinutes } = require("date-fns");
const { newBookingSchema } = require("../../validators/bookingsValidators");

async function newBooking(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    await newBookingSchema.validateAsync(req.body);
    const { idUser, idBusiness } = req.params;
    const {
      checkInTime,
      units,
      creditCardNumber,
      holderName,
      expiryDate,
      cvcCode,
    } = req.body;

    //prohibir nueva reserva sin los datos necesarios
    if (
      !idBusiness ||
      !checkInTime ||
      !units ||
      !creditCardNumber ||
      !holderName ||
      !expiryDate ||
      !cvcCode ||
      !idUser
    ) {
      throw generateError("Faltan datos para realizar la reserva", 400);
    }

    //prohibir nueva reserva si el id de usuario no es el correspondiente
    if (req.auth.id !== Number(idUser)) {
      throw generateError("No estás autorizado", 401);
    }

    //escoger la duración impuesta por el negocio y convertirla a dato manejable
    const [lengthBookingData] = await connection.query(
      `SELECT length_booking, name
      FROM business
      WHERE id=?`,
      [idBusiness]
    );
    const lengthBooking = lengthBookingData[0].length_booking;
    const frequenzy = minutesToDB(lengthBooking)

    //Si la reserva no empieza a la hora en punto o y media, la reserva no es válida
    const dateCheckInTime = new Date(checkInTime);
    const minutesCheckInTime = dateCheckInTime.getMinutes();
    if (minutesCheckInTime !== 0 && minutesCheckInTime !== 30) {
      throw generateError(
        "La hora de inicio de la reserva no es correcta",
        400
      );
    }

    //establecer fechas de check in y out de la reserva en base a la duración de la misma
    const dateCheckOutTime = addMinutes(dateCheckInTime, lengthBooking);

    //pasar fechas a formato SQL
    const checkInTimeToDB = formatDateTimeToDB(dateCheckInTime);
    const checkInDayToDB = formatDateToDB(dateCheckInTime);
    const checkOutTimeToDB = formatDateTimeToDB(dateCheckOutTime);
    const checkOutDayToDB = formatDateToDB(dateCheckOutTime);

    //establecer variables para prohibir reservar fechas pasadas
    const now = new Date();
    const dayWeek = format(dateCheckInTime, "i");
    if (dateCheckInTime < now) {
      throw generateError("no puedes reservar fechas pasadas", 400);
    }

    //Establecer variables para prohibir reservar fechas cuando esté cerrado el negocio
    const [openingDaysData] = await connection.query(
      ` SELECT day
      FROM opening_days OD
      WHERE OD.id_business=?
                          `,
      [idBusiness]
    );
    const isOpen = openingDaysData.find((d) => d.day === Number(dayWeek));
    if (!isOpen) {
      throw generateError("el negocio no está abierto", 400);
    }

    //establecer variables para prohibir reserva
    //cuyo check in o check out esté fuera de horario comercial
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
    if (
      Number(hourCheckInTime) < Number(openingTime) ||
      Number(hourCheckOutTime) > Number(closingTime)
    ) {
      throw generateError("El negocio no está abierto a esa hora", 401);
    }

    //Obtener ocupación de las plazas necesarias
    //para una determinada franja horaria
    const [ocupationData] = await connection.query(
      `SELECT SUM(units) AS ocupation
      FROM booking BK 
      WHERE BK.id_business = ? AND BK.check_in_time = ? AND BK.check_out_time = ?
      `,
      [idBusiness, checkInTimeToDB, checkOutTimeToDB]
    );
    const ocupation = ocupationData[0].ocupation;

    //obtener disponibilidad del negocio (es lineal)
    const [allotmentAvailableData] = await connection.query(
      `SELECT allotment_available
      FROM business
        WHERE id=?`,
      [idBusiness]
    );
    const allotmentAvailable = allotmentAvailableData[0].allotment_available;

    //prohibir cancelar si no hay disponibilidad
    if (
      allotmentAvailable === null ||
      allotmentAvailable === 0 ||
      ocupation >= allotmentAvailable
    ) {
      throw generateError("No quedan plazas", 400);
    }

    const [userData] = await connection.query(
      `SELECT email
      FROM users
      WHERE id=?`,
      [idUser]
    );
    const emailUser = userData[0].email;
    const businessName = lengthBookingData[0].name;
    //introducir reservar si hay disponibilidad
    if (ocupation < allotmentAvailable || ocupation === null) {
      await connection.query(
        `
            INSERT INTO booking(check_in_time,
              check_in_day,
              check_out_time,
              check_out_day,
              frequenzy_time,
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
                ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP, UTC_TIMESTAMP,
                SHA2(?,512),
                SHA2(?,512),
                SHA2(?,512),
                SHA2(?,512),
                UTC_TIMESTAMP, ?, ?
                )
                `,
        [
          checkInTimeToDB,
          checkInDayToDB,
          checkOutTimeToDB,
          checkOutDayToDB,
          frequenzy,
          units,
          creditCardNumber,
          holderName,
          expiryDate,
          cvcCode,
          idBusiness,
          idUser,
        ]
      );

      //OBTENER EL ID DE LA RESERVA NUEVA
      const [newBookingData] = await connection.query(`
      SELECT id
      FROM  booking
      ORDER BY id DESC
      LIMIT 1;  
      `);
      const idNewBooking = newBookingData[0].id;

      //MANDAR EMAIL DE CONFIRMACIÓN
      /*try {
        await sendMail({
          emailUser,
          title: `Reserva ${idNewBooking} confirmada con check-in ${checkInTime} en ${businessName}`,
          content: `Estamos encantados de confirmar tu reserva para la fecha ${checkInTime} en el negocio
          ${businessName}. Puedes acceder en tu perfil a los datos de la reserva. `,
        });
      } catch (error) {
        throw generateError("Error en el envío del email", 405);
      }*/
      //ESTABLECER LA RESPUESTA DE CONFIRMACIÓN
      res.send({
        status: "RESERVA CONFIRMADA",
        id: idNewBooking,
        data: checkInTimeToDB,
        hora: checkOutTimeToDB,
        unidades: units,
      });
    }
    //ESTABLECER LA RESPUESTA DE ERROR EN EL PROCESO.
    res.send({
      message: "Hubo un problema al realizar la reserva",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newBooking;
