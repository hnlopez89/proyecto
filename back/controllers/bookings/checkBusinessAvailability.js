const { getConnection } = require("../../db");
const { generateError, formatDateToDB } = require("../../helpers");


async function checkBusinessAvailability(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { idBusiness } = req.params;
    const { checkInDay, hour } = req.body;
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
    select check_in_day, check_in_time, COUNT(BO.id) AS bookings, 
  	BU.allotment_available AS allotment, CONCAT(COUNT(BO.id)/BU.allotment_available * 100, '%') as occ 
    FROM business BU, booking BO
    WHERE BU.id = BO.id_business AND BU.id=? AND check_in_day = '2020-07-28' AND HOUR(check_in_time) = 21
    GROUP BY check_in_day, check_in_time;`,
      [idBusiness, checkInDayDB, hour])

    // mando la respuesta
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

module.exports = checkBusinessAvailability;
