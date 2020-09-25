const { getConnection } = require("../../db");

async function listBusinessBookings(req, res, next) {
    let connection;
    try {
        connection = await getConnection();
        const { id } = req.params;

        const { idBusiness, name, category, city, province, status, order, direction } = req.query;
        if (req.auth.id !== Number(id) && req.auth.role !== "admin") {
            const error = new Error(
                "No tienes permisos para acceder a las reservas de otro negocio"
            );
            error.httpStatus = 403;
            throw error;
        }
        const orderDirection = (direction && direction.toLowerCase()) === "desc" ? "DESC" : "ASC";
        let orderBy;
        switch (order) {
            case "idBusiness":
                orderBy = "id";
                break;
            case "name":
                orderBy = "name";
                break;
            case "city":
                orderBy = "city";
                break;
            case "province":
                orderBy = "province";
                break;
            case "category":
                orderBy = "category";
                break;
            case "status":
                orderBy = "status";
                break;
            default:
                orderBy = "id";
        }
        let query = `SELECT *
            FROM business
            `;
        const params = [];
        //ESTABLECER CRITERIOS DE BÚSQUEDA SI ESTOS HAN SIDO DEFINIDOS
        if (idBusiness || name || province || category || city || status) {
            const conditions = [];
            if (idBusiness) {
                conditions.push(` id LIKE '${idBusiness}'`);
                params.push(`'%${idBusiness}%'`);
            }
            if (name) {
                conditions.push(` name LIKE '${name}'`);
                params.push(`'%${name}%'`);
            }
            if (category) {
                conditions.push(` category LIKE '${category}'`);
                params.push(`'%${category}%'`);
            }
            if (city) {
                conditions.push(` city LIKE '${city}'`);
                params.push(`'%${city}%'`);
            }
            if (province) {
                conditions.push(` province LIKE '${province}'`);
                params.push(`'%${province}%'`);
            }
            if (status) {
                conditions.push(` status LIKE '${status}'`);
                params.push(`'%${status}%'`);
            }

            //FINALIZAR CREACIÓN DE BÚSQUEDA Y EJECUCIÓN
            query = `${query} WHERE ${conditions.join(` AND `)} ORDER BY ${orderBy} ${orderDirection}`;

            console.log(query);
            const [result] = await connection.query(query);
            //RESPUESTA A LA PETICIÓN
            // mando la respuesta
            res.send({
                status: "ok",
                data: result,
            });
        }

        //EJECUTAR BÚSQUEDA POR DEFECTO
        else {
            query = `${query} ORDER BY ${orderBy} ${orderDirection}`;
            console.log(query);
            const [result] = await connection.query(query);

            // mando la respuesta
            res.send({
                status: "ok",
                data: result,
            });
        }
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
}

module.exports = listBusinessBookings;