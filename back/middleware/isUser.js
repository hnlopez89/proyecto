const jsonwebtoken = require("jsonwebtoken");
const { getConnection } = require("../db");
const { generateError } = require("../helpers");

async function isUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    // extraer token de los headers de la petición
    const { authorization } = req.headers;
    if (!authorization) {
      const error = new Error("Falta la cabecera de autorización");
      error.httpStatus = 401;
      throw error;
    }
    // comprobar que el token es válido
    // y decodificar el contenido del token
    let tokenInfo;
    try {
      tokenInfo = jsonwebtoken.verify(authorization, process.env.SECRET);
    } catch (error) {
      const tokenError = new Error("El token no es válido");
      tokenError.httpStatus = 401;
      throw tokenError;
    }

    //Sacamos de la base de datos información de la última vez
    //que el usuario cambió su pass o email
    const [result] = await connection.query(
      `SELECT last_auth_update
            FROM users
            WHERE id=?
            `,
      [tokenInfo.id]
    );

    if (result.length === 0) {
      const error = new Error("El usuario no existe en la base de datos");
      error.httpStatus = 401;
      throw error;
    }

    const tokenCreatedAt = new Date(tokenInfo.iat * 1000);
    const userLastAuthUpdate = new Date(result[0].last_auth_update);

    if (tokenCreatedAt < userLastAuthUpdate) {
      const error = new Error(
        "El token ya no es válido. Haz login para conseguir otro"
      );
      error.httpStatus = 401;
      throw error;
    }

    //meter ese contenido en el objeto de petición para futuro uso
    req.auth = tokenInfo;

    if (req.auth.role !== 'admin' && req.auth.role !== 'customer') {
      throw generateError("Para acceder a datos de usuario debes loguearte como tal", 400)
    }

    //pasar al siguiente middleware
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = isUser;
