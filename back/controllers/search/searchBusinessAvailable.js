const { getConnection } = require("../../db");
const { formatDateToDB, generateError, formatDateTimeToDB } = require("../../helpers");
console.log(formatDateToDB);

async function searchBusinessAvailable(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    //OBTENER CRITERIOS DE BÚSQUEDA DE USUARIO
    const { city, category, date, hours, minutes, name, units, order, direction } = req.query;

    //CONSTRUCCIÓN DE BÚSQUEDA
    let query = `
      SELECT BD.id, BD.name, BD.profile_picture, BD.category, BD.city, BD.opening_time, BD.closing_time, BD.vote_average, BD.total_votes
      FROM business_details BD LEFT OUTER JOIN opening_days OD ON BD.id = OD.id_business
      WHERE BD.status = 'ACTIVO' AND `;

    console.log(date);
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
      case "totalVotes":
        orderBy = "BD.total_votes";
        break;
      default:
        orderBy = "BD.total_votes";
    }

    //COMPLETAR BÚSQUEDA CON CRITERIOS DE USUARIO
    const params = [];
    if (city || category || date && hours && minutes && units && !name) {
      const conditions = [];
      if (city) {
        conditions.push(`city LIKE '${city}'`);
        params.push(`%${city}%`);
      }
      if (category) {
        conditions.push(`category LIKE '${category}'`);
        params.push(`'%${category}%'`);
      }

      if (units) {
        params.push(`'%${units}%'`);
      }

      if (date && units) {
        const dateString = new Date(date);
        dateString.setHours(hours);
        console.log(dateString);
        dateString.setMinutes(minutes);
        dateString.setHours(dateString.getHours() + 2);
        const queryUnixTime = dateString.getTime();
        const stringWeekDay = dateString.getDay();
        const weekDay = Number(stringWeekDay);
        const checkInHour = dateString.getHours();
        const dateTimeDB = formatDateTimeToDB(dateString);
        const now = new Date().getTime();
        //PROHIBIR BUSCAR EN FECHAS PASADAS
        if (now > queryUnixTime) {
          throw generateError(
            "No puedes buscar disponibilidad en fechas anteriores a la actual",
            400
          );
        }
        conditions.push(`(${weekDay} + 1) IN (SELECT day FROM opening_days WHERE id_business= BD.id) 
          AND ${checkInHour} BETWEEN BD.opening_time AND BD.closing_time 
          AND (( BD.check_in_time = '${dateTimeDB}' AND BD.allotment_available >= BD.count + ${units}) OR BD.check_in_time IS NULL OR
          '${dateTimeDB}' NOT IN (SELECT check_in_time FROM business_details WHERE id = BD.id))`);
        params.push(`'%${date}%'`, `'%${hours}%'`, `'%${minutes}%'`);
      }
      //FINALIZAR BÚSQUEDA
      query = `${query} ${conditions.join(
        ` AND `
      )} GROUP BY BD.id, BD.name ORDER BY ${orderBy} ${orderDirection}`;
      const [result] = await connection.query(query);

      console.log(query);
      //ENVÍAR BÚSQUEDA DE USUARIO
      res.send({
        status: "ok",
        data: result,
      });
    }

    //BÚSQUEDA ÚNICAMENTE DE NEGOCIOS CON EL MISMO NOMBRE
    //SE PRIORIZA ENCONTRAR EL NEGOCIO A SU DISPONIBILIDAD
    if (name && date && !city && !category) {
      query = `${query} BD.name LIKE ${name}`;
      params.push(`'%${name}%'`)
      const conditions = [];

      if (date && units) {
        if (units) {
          params.push(`'%${units}%'`);
        }
        const dateString = new Date(date);
        dateString.setHours(hours);
        console.log(dateString);
        dateString.setMinutes(minutes);
        dateString.setHours(dateString.getHours() + 2);
        const queryUnixTime = dateString.getTime();
        const stringWeekDay = dateString.getDay();
        const weekDay = Number(stringWeekDay);
        const checkInHour = dateString.getHours();
        const dateTimeDB = formatDateTimeToDB(dateString);
        const now = new Date().getTime();
        //PROHIBIR BUSCAR EN FECHAS PASADAS
        if (now > queryUnixTime) {
          throw generateError(
            "No puedes buscar disponibilidad en fechas anteriores a la actual",
            400
          );
        }
        conditions.push(`(${weekDay} + 1) IN (SELECT day FROM opening_days WHERE id_business= BD.id) 
          AND ${checkInHour} BETWEEN BD.opening_time AND BD.closing_time 
          AND (( BD.check_in_time = '${dateTimeDB}' AND BD.allotment_available >= BD.count + ${units}) OR BD.check_in_time IS NULL OR
          '${dateTimeDB}' NOT IN (SELECT check_in_time FROM business_details WHERE id = BD.id))`);
        params.push(`'%${date}%'`, `'%${hours}%'`, `'%${minutes}%'`);
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

  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = searchBusinessAvailable;
