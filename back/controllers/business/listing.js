const { getConnection } = require("../../db");

async function listing(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { city, category, date } = req.body;

    let query = `SELECT business.name, business.city, business.category, business.line1
        FROM business`;
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
        conditions.push(`date LIKE '${date}'`);
        params.push(`'%${date}%'`);
      }

      query = `${query} WHERE ${conditions.join(` AND `)}`;
      console.log(query);
    }
    console.log(query);

    const [result] = await connection.query(query);

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

module.exports = listing;
