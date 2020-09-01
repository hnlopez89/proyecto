const { getConnection } = require("../../db");
const {
  generateError,
  formatDateToDB,
  formatDateTimeToDB,
} = require("../../helpers");
const { format, addMinutes } = require("date-fns");
const { editUserBookingSchema } = require("../../validators/bookingsValidators");

async function editUserBooking(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    //obtener id de usuario y de booking de la ruta
    const { idUser, idBooking } = req.params;
    //obtener id de usuario y del negocio de la reserva
    //mediante la query en la base de datos
    //await editUserBookingSchema.validateAsync(req.body);

    const [idBookingData] = await connection.query(
      `SELECT id_user, id_business, status
      FROM booking
      WHERE id=?`,
      [idBooking]
    );
    // comprobar que la booking que queremos modificar
    // tiene el mismo id de usuario que el que firma la petición
    const idUserBooking = Number(idBookingData[0].id_user);
    if (idUserBooking !== Number(idUser)) {
      throw generateError(
        "No estas autorizado para modificar esta reserva",
        404
      );
    }
    //obtener todos los datos necesarios para hacer nueva reserva
    const { date, hours, minutes, units } = req.body;
    const idBusinessBooking = idBookingData[0].id_business;

    //prohibir nueva reserva sin los datos necesarios
    if (!idBusinessBooking || !date || !hours || !minutes || !units || !idUser) {
      throw generateError("Faltan datos para modificar la reserva", 400);
    }

    //escoger la duración impuesta por el negocio y convertirla a dato manejable
    const [lengthBookingData] = await connection.query(
      `SELECT length_booking
      FROM business
      WHERE id=?`,
      [idBusinessBooking]
    );
    const lengthBooking = lengthBookingData[0].length_booking;


    //Si la reserva no empieza a la hora en punto o y media, la reserva no es válida
    const dateCheckInTime = new Date(date);
    //const checkInTimeUnix = new Date(checkInTime);
    dateCheckInTime.setHours(hours);
    dateCheckInTime.setMinutes(minutes);
    const minutesCheckInTime = dateCheckInTime.getMinutes();
    console.log(minutesCheckInTime);
    if (minutesCheckInTime !== 0 && minutesCheckInTime !== 30) {
      throw generateError(
        "La hora de inicio de la reserva no es correcta",
        400
      );
    }
    //establecer fechas de check out de la reserva en base a la duración de la misma
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
      throw generateError(
        "no puedes cambiar tu reserva para fechas pasadas",
        400
      );
    }

    //Establecer variables para prohibir reservar fechas cuando esté cerrado el negocio
    const [openingDaysData] = await connection.query(
      ` SELECT day
      FROM opening_days OD
      WHERE OD.id_business=?
                          `,
      [idBusinessBooking]
    );
    const isOpen = openingDaysData.find((d) => d.day === Number(dayWeek));
    if (!isOpen) {
      throw generateError("el negocio no está abierto ese día", 400);
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
      [idBusinessBooking]
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
      [idBusinessBooking, checkInTimeToDB, checkOutTimeToDB]
    );
    const ocupation = ocupationData[0].ocupation;

    //obtener disponibilidad del negocio (es lineal)
    const [allotmentAvailableData] = await connection.query(
      `SELECT allotment_available
        FROM business
        WHERE id=?`,
      [idBusinessBooking]
    );
    const allotmentAvailable = allotmentAvailableData[0].allotment_available;


    const status = idBookingData[0].status;
    //introducir reservar salvo si no hay disponibilidad
    if (ocupation < allotmentAvailable || ocupation === null) {
      if (status === 'PENDIENTE_DE_PAGO') {
        await connection.query(
          `
              UPDATE booking
              SET check_in_time = ?,
              check_in_day = ?,
                check_out_time = ?,
                check_out_day = ?,
                units = ?,
                update_date = UTC_TIMESTAMP
                WHERE id = ?;
                  `,
          [
            checkInTimeToDB,
            checkInDayToDB,
            checkOutTimeToDB,
            checkOutDayToDB,
            units,
            idBooking,
          ]
        );
      }
      else {
        await connection.query(
          `
              UPDATE booking
              SET check_in_time = ?,
              check_in_day = ?,
                check_out_time = ?,
                check_out_day = ?,
                units = ?,
                update_date = UTC_TIMESTAMP,
                status = 'MODIFICADO'
                WHERE id = ?;
                  `,
          [
            checkInTimeToDB,
            checkInDayToDB,
            checkOutTimeToDB,
            checkOutDayToDB,
            units,
            idBooking,
          ]
        );
      }
    } else if (allotmentAvailable === null) {
      throw generateError("No quedan plazas", 400);
    } else {
      throw generateError("No quedan plazas", 400);
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

module.exports = editUserBooking;
