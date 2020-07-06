const { getConnection } = require("../../db");

async function getBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;
    const [result] = await connection.query(
      `
            SELECT id, name, email
            FROM business
            WHERE id=?
            `,
      [id]
    );

    if (result.length === 0) {
      const error = new Error(`El negocio con id${id} no existe`);
      error.httpStatus = 404;
      throw error;
    }

    const [businessData] = result;

    const responseData = {
      registrationDate: businessData.registrationDate,
      name: businessData.name,
    };

    if (businessData.id === req.auth.id) {
      responseData.email = businessData.email;
    }

    res.send({
      status: "ok",
      data: responseData,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getBusiness;
