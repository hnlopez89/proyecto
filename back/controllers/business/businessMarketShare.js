const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");



async function businessMarketShare(req, res, next) {
    let connection;
    try {
        connection = await getConnection();

        const { id } = req.params;
        console.log(id);
        const [infoBusiness] = await connection.query(`
    SELECT category, province
    FROM business
    WHERE id=?`,
            [id]);

        const category = infoBusiness[0].category;
        const province = infoBusiness[0].province;
        if (req.auth.id !== Number(id)) {
            throw generateError("No tienes permisos para acceder a las reservas de otro negocio", 403);
        }
        const now = new Date();
        const year = now.getFullYear();
        console.log(year);

        const yearlyShare = []
        for (let i = 1; i <= 12; i++) {
            const [result] = await connection.query(`
        select MONTH(check_in_time) as check_in_month, COUNT(BO.id) AS your_bookings, (SELECT COUNT(BO.id) AS bookings
            FROM business BU, booking BO
                WHERE BU.id = BO.id_business AND BU.category=? AND BU.province =? AND MONTH(check_in_time) =? AND YEAR(check_in_time) = ?
                AND NOT BO.status = 'CANCELADO') as total_bookings, COUNT(BO.id)/ (SELECT COUNT(BO.id) AS bookings
                    FROM business BU, booking BO
                    WHERE BU.id = BO.id_business AND BU.category=? AND BU.province =? AND MONTH(check_in_time) =? AND YEAR(check_in_time) = ?
                    AND NOT BO.status = 'CANCELADO') * 100 as percentage
            FROM business BU, booking BO
            WHERE BU.id = BO.id_business AND BU.id=? AND MONTH(check_in_time) = ? AND YEAR(check_in_time) = ?
            AND NOT BO.status = 'CANCELADO' 
            GROUP BY check_in_month;`,
                [category, province, i, year, category, province, i, year, id, i, year])


            const [simpleResult] = result;
            if (simpleResult === undefined) {
                const [competitorsBookingsData] = await connection.query(`
                SELECT COUNT(BO.id) AS bookings
            FROM business BU, booking BO
                WHERE BU.id = BO.id_business AND BU.category = ? AND BU.province = ? AND MONTH(check_in_time) = ? AND YEAR(check_in_time) = ?
            AND NOT BO.status = 'CANCELADO';
                `,
                    [category, province, i, year])
                const competitorsBookings = competitorsBookingsData[0].bookings;
                console.log(competitorsBookings);
                if (competitorsBookings !== undefined) {
                    const existingCompetitors = {
                        "check_in_month": i,
                        "your_bookings": 0,
                        "total_bookings": competitorsBookings,
                        "percentage": "00.0000"
                    }
                    yearlyShare.push(existingCompetitors)
                } else {

                    const noResult = {
                        "check_in_month": i,
                        "your_bookings": 0,
                        "total_bookings": 0,
                        "percentage": "00.0000"
                    }
                    yearlyShare.push(noResult)
                }
            } else {
                yearlyShare.push(simpleResult)
            }

        }
        // mando la respuesta
        res.send({
            yearlyShare,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
}

module.exports = businessMarketShare;
