const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function getUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    //OBTENER ID DE USUARIO
    const { id } = req.params;
    const [profile] = await connection.query(
      `
        SELECT id, name, surname, email, picture
        FROM users
        WHERE id=?
        `,
      [id]
    );

    //PROHIBIR ACCEDER A PERFILES AJENOS
    if (Number(id) !== req.auth.id) {
      throw generateError("No puedes acceder a perfiles ajenos")
    }

    //ELABORAR DATOS DE RESPUESTA A IMPRIMIR EN EL PERFIL
    const picture = profile[0].picture;
    const name = profile[0].name;
    const surname = profile[0].surname;
    res.send({
      status: "ok",
      name: name,
      surname: surname,
      avatar: picture,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getUser;
