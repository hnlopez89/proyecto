/* EN CONSTRUCCIÓN

const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function listBookingsPending(req, res, next) {
    let connection;
    try {
        connection = await getConnection();
        if (req.auth.role !== "admin") {
            throw generateError("No estás autorizado para acceder a esta información", 400)
        }

        await connection.query(`
        SELECT booking.id_business, business.name, (SELECT AVG(rating) FROM booking WHERE booking.id_business = business.id) AS vote_average,
        (SELECT COUNT(rating) FROM booking WHERE id_business = business.id) AS total_votes
        FROM booking INNER JOIN business  ON booking.id_business = business.id
        GROUP BY booking.id_business`)
    }
    catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
}
*/