const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function getUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    //OBTENER ID DE USUARIO
    const { id } = req.params;
    const [data] = await connection.query(
      `
        SELECT *
        FROM users
        WHERE id=?
        `,
      [id]
    );
    console.log(req.auth.id, req.auth.role);
    //PROHIBIR ACCEDER A PERFILES AJENOS
    if (Number(id) !== req.auth.id && req.auth.role !== "admin") {
      throw generateError("No puedes acceder a perfiles ajenos")
    }

    //ELABORAR DATOS DE RESPUESTA A IMPRIMIR EN EL PERFIL
    res.send({
      status: "ok",
      data
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getUser;
