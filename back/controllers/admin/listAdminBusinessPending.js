const { getConnection } = require("../../db");
async function listBusinessPending(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    // Sacamos las posibles opciones del querystring:
    //search: nombre de negocio, hora, localidad, categoría
    //order: para ordenar el listado por voteAverage, place o date
    // direction: para la dirección de la ordenación desc o asc
    const { search, order, direction } = req.query;

    //proceso la dirección de orden
    const orderDirection =
      (direction && direction.toLowerCase()) === "desc" ? "DESC" : "ASC";

    console.log(order);
    //proceso el campo de orden
    let orderBy;
    switch (order) {
      case "city":
        orderBy = "city";
        break;
      default:
        orderBy = "name";
    }
    // ejecuto la query en base a si existe queryString de search o no
    let queryResults;
   /* if (search) {
      queryResults = await connection.query(
        `SELECT BD.id, BD.profile_picture, BD.name, BD.category, BD.city, BD.opening_time, BD.closing_time, BD.vote_average, BD.total_votes
        FROM business_details BD LEFT OUTER JOIN opening_days OD ON BD.id = OD.id_business
        WHERE BD.status = 'PENDIENTE'        
        AND city LIKE ? or category LIKE ?
        GROUP BY BD.id, BD.name
        ORDER BY ${orderBy} ${orderDirection};
        `,
        [`%${search}%`, `%${search}%`]
      );
    } else */if (order && direction) {
      queryResults = await connection.query(
        `SELECT BD.id, BD.profile_picture, BD.name, BD.category, BD.city, BD.opening_time, BD.closing_time, BD.vote_average, BD.total_votes
        FROM business_details BD LEFT OUTER JOIN opening_days OD ON BD.id = OD.id_business
        WHERE BD.status = 'PENDIENTE' 
        GROUP BY BD.id, BD.name  
        ORDER BY ${orderBy} ${orderDirection};`
      );

    }
    else if (!direction) {
      queryResults = await connection.query(
        `SELECT BD.id, BD.profile_picture, BD.name, BD.category, BD.city, BD.opening_time, BD.closing_time, BD.vote_average, BD.total_votes
        FROM business_details BD LEFT OUTER JOIN opening_days OD ON BD.id = OD.id_business
        WHERE BD.status = 'PENDIENTE' 
        GROUP BY BD.id, BD.name `)
      console.log();
    }
    // extraigo los resultados reales del resultado de la query
    const [result] = queryResults;

    // mando la respuesta
    res.send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = listBusinessPending;
