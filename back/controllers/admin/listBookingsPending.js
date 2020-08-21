const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function listBookingsPending(req, res, next) {
    let connection;
    try {
        connection = await getConnection();
        if (req.auth.role !== "admin") {
            throw generateError("No estás autorizado para acceder a esta información", 400)
        }

        const [list] = await connection.query(`
        SELECT *
        FROM booking
        WHERE status = 'PENDIENTE_DE_PAGO'`);
        res.send({
            data: list,
        });
    }
    catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
}

module.exports = listBookingsPending;