const { getConnection } = require("../../db");
const { formatDateToDB, formatDateTimeToDB, generateError } = require("../../helpers");

async function listBusinessBookingsAdvanced(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    //OBTENER CRITORIOS DE BÚSQUEDA
    const { idBusiness } = req.params;
    const { idBooking, name, surname, checkInDay, checkInTime, status, creatingDate, units, order, direction } = req.query;
    //PROHÍBIR ACCEDER A DATOS AJENOS
    if (req.auth.id !== Number(idBusiness)) {
      throw generateError("No tienes permisos para acceder a las reservas de otro negocio", 403)
    }

    //CONSTRUIR INICIO DE QUERY
    let query = `SELECT  B.id, U.name, U.surname, B.id_user,B.check_in_day, B.check_in_time, B.check_out_time, B.status, B.units, B.request, B.creating_date, B.update_date, B.rating, B.rating_description
    FROM booking B
    LEFT OUTER JOIN  users U on B.id_user = U.id
    LEFT OUTER JOIN business ON B.id_business = business.id
    WHERE B.id_business = '${idBusiness}'`;

    //ESTABLECER ORDEN Y SENTIDO DE BÚSQUEDA
    const orderDirection = (direction && direction.toLowerCase()) === "desc" ? "DESC" : "ASC";
    let orderBy;
    switch (order) {
      case "id":
        orderBy = "B.id";
        break;
      case "name":
        orderBy = "U.name";
        break;
      case "surname":
        orderBy = "U.surname";
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
        orderBy = "B.check_in_time";
    }

    const params = [];
    //ESTABLECER CRITERIOS DE BÚSQUEDA SI ESTOS HAN SIDO DEFINIDOS
    if (idBooking || name || surname || checkInDay || checkInTime || status || creatingDate || units) {
      const conditions = [];

      if (idBooking) {
        conditions.push(` B.id LIKE '${idBooking}'`);
        params.push(`'%${idBooking}%'`);
      }

      if (name) {
        conditions.push(` U.name LIKE '${name}'`);
        params.push(`'%${name}%'`);
      }

      if (surname) {
        conditions.push(` U.surname LIKE '${surname}'`);
        params.push(`'%${surname}%'`);
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

      //RESPUESTA A LA PETICIÓN
      res.send({
        status: "ok",
        data: result,
      });
    }
    //EJECUTAR BÚSQUEDA POR DEFECTO
    else {
      query = `${query} ORDER BY ${orderBy} ${orderDirection}`;
      const [result] = await connection.query(query);
      console.log(query);
      //RESPUESTA A LA PETICIÓN
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

module.exports = listBusinessBookingsAdvanced;
