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
      case "id":
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
      default:
        orderBy = "id";
    }
    // ejecuto la query en base a si existe queryString de search o no
    let queryResults;
    if (order && direction) {
      queryResults = await connection.query(
        `SELECT *
        FROM business
        WHERE status ='PENDIENTE'
        ORDER BY ${orderBy} ${orderDirection};`
      );
      console.log(orderBy);
    }
    else {
      queryResults = await connection.query(
        `SELECT *
        FROM business
        WHERE status ='PENDIENTE'        GROUP BY id, name `)
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
