const { generateError } = require("../helpers");
const { getConnection } = require("../db");

async function isAdmin(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    if (req.auth.role === "admin") {
      //pasar al siguiente middleware
      next();
    } else {
      throw generateError("No tienes privilegios de administrador", 404);
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = isAdmin;
