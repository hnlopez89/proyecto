const { getConnection } = require("../../db");
const { formatDateToDB, generateError } = require("../../helpers");
console.log(formatDateToDB);

async function searchBusinessAvailable(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    //OBTENER CRITERIOS DE BÚSQUEDA DE USUARIO
    const { city, category, date, name, order, direction } = req.body;
    const dateString = new Date(date);
    const queryUnixTime = dateString.getTime();
    const stringWeekDay = dateString.getDay();
    const weekDay = Number(stringWeekDay);
    const checkInHour = dateString.getHours();
    const dateTimeDB = formatDateToDB(date);
    const now = new Date().getTime();

    //PROHIBIR BUSCAR EN FECHAS PASADAS
    if (now > queryUnixTime) {
      throw generateError(
        "No puedes buscar disponibilidad en fechas anteriores a la actual",
        400
      );
    }

    //CONSTRUCCIÓN DE BÚSQUEDA
    let query = `
      SELECT BD.name, BD.profile_picture, BD.category, BD.city, BD.opening_time, BD.closing_time, BD.vote_average, BD.total_votes
      FROM business_details BD LEFT OUTER JOIN opening_days OD ON BD.id = OD.id_business
      WHERE BD.status = 'ACTIVO' AND `;

    //ESTABLECER ORDEN Y SENTIDO DE BÚSQUEDA
    const orderDirection = (direction && direction.toLowerCase()) === "asc" ? "ASC" : "DESC";
    let orderBy;
    switch (order) {
      case "voteAverage":
        orderBy = "BD.vote_average";
        break;
      case "name":
        orderBy = "BD.name";
        break;
      default:
        orderBy = "BD.total_votes";
    }

    //COMPLETAR BÚSQUEDA CON CRITERIOS DE USUARIO
    const params = [];
    if (city || category || date) {
      const conditions = [];
      if (city) {
        conditions.push(`city LIKE '${city}'`);
        params.push(`%${city}%`);
      }
      if (category) {
        conditions.push(`category LIKE '${category}'`);
        params.push(`'%${category}%'`);
      }
      if (date) {
        conditions.push(`(${weekDay} + 1) IN (SELECT day FROM opening_days WHERE id_business= BD.id) 
        AND ${checkInHour} BETWEEN BD.opening_time AND BD.closing_time 
        AND (( BD.check_in_time = '${dateTimeDB}' AND BD.allotment_available > BD.count) OR BD.check_in_time IS NULL OR
        '${dateTimeDB}' NOT IN (SELECT check_in_time FROM business_details WHERE id = BD.id))`);
        params.push(`'%${date}%'`);
      }

      //FINALIZAR BÚSQUEDA
      query = `${query} ${conditions.join(
        ` AND `
      )} GROUP BY BD.id, BD.name ORDER BY ${orderBy} ${orderDirection}`;
      const [result] = await connection.query(query);

      //ENVÍAR BÚSQUEDA DE USUARIO
      res.send({
        status: "ok",
        data: result,
      });
    }

    //BÚSQUEDA ÚNICAMENTE DE NEGOCIOS CON EL MISMO NOMBRE
    //SE PRIORIZA ENCONTRAR EL NEGOCIO A SU DISPONIBILIDAD
    if (name && !city && !category && !date) {
      query = `${query} AND BD.name LIKE ${name} GROUP BY BD.id, BD.name 
      ORDER BY ${orderBy} ${orderDirection}`;
      params.push(`'%${name}%'`)
      const [result] = await connection.query(query);

      //ENVÍAR BÚSQUEDA DE USUARIO
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

module.exports = searchBusinessAvailable;
