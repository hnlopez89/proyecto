const { getConnection } = require("../../db");
const { formatDateToDB, generateError } = require("../../helpers");

async function listUserBookingsAdvanced(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    //OBTENER CRITORIOS DE BÚSQUEDA
    const { id } = req.params;
    const { checkInDay, status, creatingDate, name, category, city, province, order, direction } = req.query;

    //PROHÍBIR ACCEDER A DATOS AJENOS
    if (req.auth.id !== Number(id)) {
      throw generateError("No tienes permisos para acceder a este usuario", 403);
    }

    //CONSTRUIR INICIO DE QUERY
    let query = `SELECT B.id, B.check_in_day, B.check_in_time, B.check_out_time, B.status, B.units, BU.name, BU.category, BU.city, BU.province
            FROM booking B
            INNER JOIN business BU ON B.id_business = BU.id
            INNER JOIN users U ON B.id_user = U.id
            WHERE U.id = '${id}' `;

    //ESTABLECER ORDEN Y SENTIDO DE BÚSQUEDA
    const orderDirection = (direction && direction.toLowerCase()) === "desc" ? "DESC" : "ASC";
    let orderBy;
    switch (order) {
      case "id":
        orderBy = "B.id";
        break;
      case "name":
        orderBy = "BU.name";
        break;
      case "check_in_time":
        orderBy = "B.check_in_time";
        break;
      case "status":
        orderBy = "B.status";
        break;
      case "units":
        orderBy = "B.units";
        break;
      case "city":
        orderBy = "BU.city";
        break;
      case "province":
        orderBy = "BU.province";
        break;
      case "category":
        orderBy = "BU.category";
        break;
      default:
        orderBy = "B.check_in_time";
    }

    const params = [];
    //ESTABLECER CRITERIOS DE BÚSQUEDA SI ESTOS HAN SIDO DEFINIDOS
    if (checkInDay || status || creatingDate || name || category || city || province) {
      const conditions = [];


      if (checkInDay) {
        const dateTimeDB = formatDateToDB(checkInDay)
        conditions.push(` B.check_in_day = '${dateTimeDB}'`);
        params.push(`'%${dateTimeDB}%'`);
      }

      if (status) {
        conditions.push(` B.status LIKE '${status}'`);
        params.push(`'%${status}%'`);
      }

      if (creatingDate) {
        const dateTimeDB = formatDateToDB(creatingDate);
        conditions.push(` B.creating_date = '${dateTimeDB}'`);
        params.push(`'%${dateTimeDB}%'`);
      }

      if (name) {
        conditions.push(` BU.name LIKE '${name}'`);
        params.push(`'%${name}%'`);
      }

      if (category) {
        conditions.push(` BU.category LIKE '${category}'`);
        params.push(`'%${category}%'`);
      }

      if (city) {
        conditions.push(` BU.city LIKE '${city}'`);
        params.push(`'%${city}%'`);
      }
      if (province) {
        conditions.push(` BU.province LIKE '${province}'`);
        params.push(`'%${city}%'`);
      }


      //FINALIZAR CREACIÓN DE BÚSQUEDA Y EJECUCIÓN
      query = `${query} AND ${conditions.join(` AND `)} ORDER BY ${orderBy} ${orderDirection}`;
      const [result] = await connection.query(query);

      console.log(query);
      //RESPUESTA A LA PETICIÓN
      res.send({
        status: "ok",
        data: result,
      });
    }

    //EJECUTAR BÚSQUEDA POR DEFECTO
    else {
      query = `${query} AND (B.status = 'CONFIRMADO' OR B.status = 'MODIFICADO' OR B.status = 'PENDIENTE_DE_PAGO') ORDER BY ${orderBy} ${orderDirection}`;
      const [result] = await connection.query(query);
      console.log(query);

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

module.exports = listUserBookingsAdvanced;
