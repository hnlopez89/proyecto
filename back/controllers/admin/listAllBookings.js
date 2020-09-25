const { getConnection } = require("../../db");
const { formatDateToDB, formatDateTimeToDB, generateError } = require("../../helpers");

async function listBusinessBookings(req, res, next) {
    let connection;
    try {
        connection = await getConnection();
        const { id } = req.params;
        if (req.auth.id !== Number(id) && req.auth.role !== "admin") {
            throw generateError("No tienes permisos para acceder a las reservas de otro negocio", 403)

        }

        //OBTENER CRITORIOS DE BÚSQUEDA
        const { idBooking, idBusiness, businessName, category, province, idUser, surname, checkInDay, checkInTime, status, creatingDate, units, order, direction } = req.query;

        //CONSTRUIR INICIO DE QUERY
        let query = `SELECT  B.id, B.id_business, BU.name, BU.category, BU.city, BU.province, B.id_user, U.surname,
        B.check_in_day, B.check_in_time, B.check_out_time, B.status,
        B.units, B.request, B.creating_date, B.update_date, B.rating, B.rating_description
    FROM booking B
    INNER JOIN users U on B.id_user = U.id
    INNER JOIN business BU ON B.id_business = BU.id
            `;

        //ESTABLECER ORDEN Y SENTIDO DE BÚSQUEDA
        const orderDirection = (direction && direction.toLowerCase()) === "desc" ? "DESC" : "ASC";
        let orderBy;
        switch (order) {
            case "idBooking":
                orderBy = "B.id";
                break;
            case "idBusiness":
                orderBy = "B.id_business";
                break;
            case "businessName":
                orderBy = "BU.name";
                break;
            case "category":
                orderBy = "BU.category";
                break;
            case "idUser":
                orderBy = "B.id_user";
                break;
            case "surname":
                orderBy = "U.surname";
                break;
            case "province":
                orderBy = "BU.province";
                break;
            case "check_in_time":
                orderBy = "B.check_in_time";
                break;
            case "check_in_day":
                orderBy = "B.check_in_day";
                break;
            case "status":
                orderBy = "B.status";
                break;
            case "units":
                orderBy = "B.units";
                break;
            case "rating":
                orderBy = "B.rating";
                break;
            case "creating_date":
                orderBy = "B.creating_date";
                break;
            default:
                orderBy = "B.id";
        }

        const params = [];
        //ESTABLECER CRITERIOS DE BÚSQUEDA SI ESTOS HAN SIDO DEFINIDOS
        if (idBooking || idBusiness || businessName || category || idUser || province ||
            surname || checkInDay || checkInTime || status || creatingDate || units) {
            const conditions = [];

            if (idBooking) {
                conditions.push(` B.id LIKE '${idBooking}'`);
                params.push(`'%${idBooking}%'`);
            }
            if (idBusiness) {
                conditions.push(` B.id_business LIKE '${idBusiness}'`);
                params.push(`'%${idBusiness}%'`);
            }
            if (businessName) {
                conditions.push(` BU.name LIKE '${businessName}'`);
                params.push(`'%${businessName}%'`);
            }
            if (category) {
                conditions.push(` BU.category LIKE '${category}'`);
                params.push(`'%${category}%'`);
            }
            if (idUser) {
                conditions.push(` B.id_user LIKE '${idUser}'`);
                params.push(`'%${idUser}%'`);
            }

            if (surname) {
                conditions.push(` U.surname LIKE '${surname}'`);
                params.push(`'%${surname}%'`);
            }
            if (province) {
                conditions.push(` BU.province LIKE '${province}'`);
                params.push(`'%${province}%'`);
            }

            if (status) {
                conditions.push(` B.status LIKE '${status}'`);
                params.push(`'%${status}%'`);
            }

            if (checkInDay) {
                const dateTimeDB = formatDateToDB(checkInDay)
                conditions.push(` B.check_in_day = '${dateTimeDB}'`);
                params.push(`'%${dateTimeDB}%'`);
            }

            if (checkInTime) {
                const dateTimeDB = formatDateTimeToDB(checkInTime)
                conditions.push(` B.check_in_day = '${dateTimeDB}'`);
                params.push(`'%${dateTimeDB}%'`);
            }

            if (units) {
                conditions.push(` B.units LIKE '${units}'`);
                params.push(`'%${units}%'`);
            }

            if (creatingDate) {
                const dateTimeDB = formatDateToDB(creatingDate);
                conditions.push(` B.creating_date = '${dateTimeDB}'`);
                params.push(`'%${dateTimeDB}%'`);
            }


            //FINALIZAR CREACIÓN DE BÚSQUEDA Y EJECUCIÓN
            query = `${query} AND ${conditions.join(` AND `)} ORDER BY ${orderBy} ${orderDirection}`;

            const [result] = await connection.query(query);
            console.log(query);
            console.log(result);
            //RESPUESTA A LA PETICIÓN
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
            console.log(result);

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