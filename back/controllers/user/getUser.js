const { getConnection } = require("../../db");

async function getUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;
    const [result] = await connection.query(
      `
        SELECT id, name, email
        FROM users
        WHERE id=?
        `,
      [id]
    );

    if (result.length === 0) {
      const error = new Error(`El usuario con id${id} no existe`);
      error.httpStatus = 404;
      throw error;
    }

    const [userData] = result;

    const responseData = {
      registrationDate: userData.registrationDate,
      name: userData.name,
      image: userData.image,
    };

    if (userData.id === req.auth.id) {
      responseData.email = userData.email;
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

module.exports = getUser;
