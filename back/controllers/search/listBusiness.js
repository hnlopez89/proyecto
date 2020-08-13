const { getConnection } = require("../../db");

async function listBusiness(req, res, next) {
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

    //proceso el campo de orden
    let orderBy;
    switch (order) {
      case "voteAverage":
        orderBy = "voteAverage";
        break;
      case "city":
        orderBy = "city";
        break;
      default:
        orderBy = "name";
    }
    // ejecuto la query en base a si existe queryString de search o no
    let queryResults;
    if (search) {
      queryResults = await connection.query(
        `SELECT business.id, business.name, business.category, business.opening_time, business.score, business.number_reviews, business.city,
        (SELECT AVG(rating) FROM booking WHERE id_business = business.id) AS voteAverage      
        FROM business
        WHERE city LIKE ? or category LIKE ?
        ORDER BY ${orderBy} ${orderDirection}
        `,
        [`%${search}%`, `%${search}%`]
      );
    } else {
      queryResults = await connection.query(
        `SELECT business.name, business.category, business.opening_time, business.score, business.number_reviews, business.city,
                (SELECT AVG(rating) FROM booking WHERE id_business = business.id) AS voteAverage      
              FROM business
              ORDER BY ${orderBy} ${orderDirection}`
      );
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

module.exports = listBusiness;
