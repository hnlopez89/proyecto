const { getConnection } = require("../../db");

async function getCustomer(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;
    const [result] = await connection.query(
      `
        SELECT id, name, email
        FROM customers
        WHERE id=?
        `,
      [id]
    );

    if (result.length === 0) {
      const error = new Error(`El usuario con id${id} no existe`);
      error.httpStatus = 404;
      throw error;
    }

    const [customerData] = result;

    const responseData = {
      registrationDate: customerData.registrationDate,
      name: customerData.name,
      image: customerData.image,
    };

    if (customerData.id === req.auth.id) {
      responseData.email = customerData.email;
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

module.exports = getCustomer;
