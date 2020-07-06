const { getConnection } = require("../../db");
const jsonwebtoken = require("jsonwebtoken");

async function loginBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error(
        "Faltan datos para hacer login es necesario enviar el email y la password"
      );
      error.httpStatus = 409;
      throw error;
    }

    // seleccionar el usuario de la base de datos y comprobar que las passwords coinciden
    const [dbBusiness] = await connection.query(
      `SELECT id, status
        FROM business
        WHERE email=? AND password= SHA2(?,512)
        `,
      [email, password]
    );

    if (dbBusiness.length === 0) {
      const error = new Error(
        "No hay ningún usuario registrado con ese email o la password es incorrecta"
      );
      error.httpStatus = 401;
      throw error;
    } else if (dbBusiness[0].status !== "OPERATIVO") {
      const error = new Error(
        "El usuario está registrado pero no activado. Por favor, revisa tu email y activalo"
      );
      error.httpStatus = 401;
      throw error;
    }
    const tokenInfo = {
      id: dbBusiness[0].id,
    };
    const token = jsonwebtoken.sign(tokenInfo, process.env.SECRET, {
      expiresIn: "30d",
    });
    res.send({
      status: "ok",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = loginBusiness;
