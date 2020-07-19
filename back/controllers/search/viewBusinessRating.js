const { getConnection } = require("../../db");

async function viewBusinessRating(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;
    const [summary] = await connection.query(
      `
    SELECT  AVG(rating) AS vote_average,
            COUNT(rating) AS count
            FROM booking 
            WHERE id_business=?
    `,
      [id]
    );
    const [result] = await connection.query(
      `
            SELECT U.name,
            check_in_time,
            rating,
            rating_description
            FROM booking B LEFT OUTER JOIN users U
            ON U.id = B.id_user
            WHERE B.id_business=?
            `,
      [id]
    );
    if (result.length === 0) {
      const error = new Error(`Este negocio ${id} no tuvo ningún voto todavía`);
      error.httpStatus = 404;
      throw error;
    }

    res.send({
      status: "ok",
      summary: summary,
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = viewBusinessRating;
