const jsonwebtoken = require("jsonwebtoken");
const { getConnection } = require("../db");

async function isBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    //extraer token de los headers de la petición
    const { authorization } = req.headers;
    if (!authorization) {
      const error = new Error("Falta la cabecera de autorización");
      error.httpStatus = 401;
      throw error;
    }
    //comprobar que el token es válido
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
          FROM business
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
    const businessLastAuthUpdate = new Date(result[0].last_auth_update);
    console.log(tokenCreatedAt, businessLastAuthUpdate);

    if (tokenCreatedAt < businessLastAuthUpdate) {
      const error = new Error(
        "el token ya no es válido. Haz login para conseguir otro"
      );
      error.httpStatus = 401;
      throw error;
    }

    //meter ese contenido en el objeto de petición para futuro uso
    req.auth = tokenInfo;
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = isBusiness;
