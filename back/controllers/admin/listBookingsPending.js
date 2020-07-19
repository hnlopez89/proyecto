/* en construcción

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
        SELECT id_user, id_business, check_in_time, status (SELECT AVG(rating) FROM booking WHE,
        FROM booking
        WHERE status = 'PENDIENTE_DE_PAGO'
    }
    catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
}
*/