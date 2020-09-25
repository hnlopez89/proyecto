const { getConnection } = require("../../db");
const jsonwebtoken = require("jsonwebtoken");
const { generateError } = require("../../helpers");
const { loginBusinessSchema } = require("../../validators/businessValidators")


async function loginBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    await loginBusinessSchema.validateAsync(req.body);
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
      `SELECT id, status, name, update_date, category
        FROM business
        WHERE email=? AND password= SHA2(?,512)
        `,
      [email, password]
    );

    if (dbBusiness.length === 0) {
      throw generateError(
        "No hay ningún usuario registrado con ese email o la password es incorrecta",
        401
      );
    } else if (dbBusiness[0].status === "SIN_VALIDAR") {
      throw generateError(
        "El usuario está registrado pero no validado. Por favor, revisa tu email y activalo",
        401
      );
    }
    const tokenInfo = {
      id: dbBusiness[0].id,
      name: dbBusiness[0].name,
      category: dbBusiness[0].category


    };
    const token = jsonwebtoken.sign(tokenInfo, process.env.SECRET, {
      expiresIn: "30d",
    });

    await connection.query(
      `UPDATE business
      SET update_date=UTC_TIMESTAMP()
      WHERE email=?
      `,
      [email]
    )


    res.send({
      status: "ok",
      data: {
        dbBusiness,
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
