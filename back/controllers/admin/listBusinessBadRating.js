const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function listBusinessBadRating(req, res, next) {
    let connection;
    try {
        connection = await getConnection();
        if (req.auth.role !== "admin") {
            throw generateError("No estás autorizado para acceder a esta información", 400)
        }

        const [list] = await connection.query(`
        SELECT B.id_business, BU.name, (SELECT AVG(rating) FROM booking B WHERE B.id_business = BU.id) AS vote_average,
        (SELECT COUNT(rating) FROM booking B WHERE B.id_business = BU.id) AS total_votes
        FROM booking B INNER JOIN business BU  ON B.id_business = BU.id
        WHERE (SELECT AVG(rating) FROM booking B WHERE B.id_business = BU.id) < 2.5
        GROUP BY B.id_business
        ORDER BY vote_average`)

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

module.exports = listBusinessBadRating;