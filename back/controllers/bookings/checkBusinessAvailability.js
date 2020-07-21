const { getConnection } = require("../../db");
const { generateError, formatDateToDB } = require("../../helpers");


async function checkBusinessAvailability(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { idBusiness } = req.params;
    const { checkInDay, hour } = req.body;

    const [infoBusiness] = await connection.query(`
SELECT opening_time, closing_time, allotment
FROM business
WHERE id=?`,
      [idBusiness]);

    const allotment = infoBusiness[0].allotment;
    const openingTime = infoBusiness[0].opening_time;
    const closingTime = infoBusiness[0].closing_time;

    console.log(idBusiness, openingTime, closingTime);

    if (req.auth.id !== Number(idBusiness)) {
      throw generateError("No tienes permisos para acceder a las reservas de otro negocio", 403);
    }
    const now = new Date();
    const checkInDayJS = new Date(checkInDay);
    if (checkInDayJS < now) {
      throw generateError("No puedes consultar disponibilidad en fechas pasadas", 403)
    }


    const checkInDayDB = formatDateToDB(checkInDayJS);

    const [result] = await connection.query(`
    select check_in_day, HOUR(check_in_time) as check_in_time, COUNT(BO.id) AS bookings, 
  	BU.allotment_available AS allotment, CONCAT(COUNT(BO.id)/BU.allotment_available * 100, '%') as occ 
    FROM business BU, booking BO
    WHERE BU.id = BO.id_business AND BU.id=? AND check_in_day = ?
    GROUP BY check_in_day, check_in_time;`,
      [idBusiness, checkInDayDB, hour])
    const bookingTimes = []


    console.log(result);
    for (let i = Number(openingTime); i <= closingTime; i++) {
      const current = result.find(r => r.check_in_time === i);
      if (current) {
        bookingTimes.push(current)
      }
      else {
        bookingTimes.push({
          "check_in_day": checkInDayDB,
          "check_in_time": i,
          "bookings": 0,
          "allotment": allotment,
          "occ": "00.0000%"
        })
      }
    }

    // mando la respuesta
    res.send({
      status: "ok",
      data: bookingTimes,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = checkBusinessAvailability;
