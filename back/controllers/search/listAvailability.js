const { getConnection } = require("../../db");
const formatDateToDB = require("../../helpers");

async function listAvailability(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { checkIn } = req.query;
    const checkInTime = formatDateToDB(checkIn);
    console.log(checkIn, checkInTime);

    const queryResults = await connection.query(
      `SELECT B.name, B.score, B.number_reviews, B.city,
        FROM business B booking BK
        WHERE B.allotment_available >
            (SELECT SUM (BK.units)
            FROM booking BK) AND */
      
        `
    );

    // extraigo los resultados reales del resultado de la query
    //const [result] = queryResults;

    // mando la respuesta
    res.send();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = listAvailability;
