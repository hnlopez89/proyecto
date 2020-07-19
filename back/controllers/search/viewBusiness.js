const { getConnection } = require("../../db");

async function viewBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;
    const [result] = await connection.query(
      `
            SELECT name,
            manager,
            category,
            opening_time,
            closing_time,
            description,
            profile_picture,
            city,
            zip_code,
            province,
            line1,
            line2,
            (SELECT AVG(rating)
            FROM booking
            WHERE id_business = B.id) AS vote_average,
            (SELECT COUNT(rating)
            FROM booking
            WHERE id_business = B.id) AS count
            FROM business B LEFT JOIN booking
            ON id_business = B.id
            WHERE B.id=?
            `,
      [id]
    );
    if (result.length === 0) {
      const error = new Error(`El negocio con id${id} no existe`);
      error.httpStatus = 404;
      throw error;
    }
    const [pictures] = await connection.query(
      `
        SELECT *
        FROM pictures
        WHERE id_business = ?
        `,
      [id]
    );

    res.send({
      status: "ok",
      data: result,
      pictures: pictures,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = viewBusiness;
