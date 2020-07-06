const { getConnection } = require("../../db");

const {
  randomString,
  sendMail,
  processAndSaveImage,
} = require("../../helpers");

async function editUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;
    const { email, name } = req.body;
    // comprobar que el id de usuario que queremos cambiar es
    // el mismo que firma la petición
    if (req.auth.id !== Number(id)) {
      const error = new Error("No tienes permisos para editar este usuario");
      error.httpStatus = 403;
      throw error;
    }

    //comprobar que el usuario existe
    const [currentUser] = await connection.query(
      `SELECT id, email, picture
            FROM customers
            WHERE id=?
            `,
      [id]
    );

    console.log(currentUser[0].email);

    if (currentUser.length === 0) {
      const error = new Error(`El usuario con id ${id} no existe`);
      error.httpStatus = 404;
      throw error;
    }

    // si mandamos imagen guardar avatar

    let savedFileName;
    if (req.files && req.files.avatar) {
      try {
        //procesar y guardar imagen
        savedFileName = await processAndSaveImage(req.files.avatar);
      } catch (error) {
        const imageError = new Error(
          " No se pudo procesar la imagen. Intentalo de nuevo."
        );
        imageError.httpStatus = 400;
        throw imageError;
      }
    } else {
      savedFileName = currentUser[0].image;
    }
    // si el email es diferente al actual, comprobar que no existe en la base de datos

    console.log(email, currentUser[0].email);

    if (email !== currentUser[0].email) {
      const [existingEmail] = await connection.query(
        `SELECT id
                FROM customers
                WHERE email=?`,
        [email]
      );
      console.log("Iñaki pide otro console log un poco más abajo");
      if (existingEmail.length > 0) {
        const error = new Error(
          "Ya existe un usuario con este email en la base de datos"
        );
        error.httpStatus = 403;
        throw error;
      }
      //verificamos de nuevo el email recibido
      const registrationCode = randomString(40);
      const validationURL = `${process.env.PUBLIC_HOST}/customer/validate/${registrationCode}`;

      // Enviamos la url anterior por mail
      try {
        await sendMail({
          email,
          title:
            "Cambiaste tu email en la aplicación tempo. Por favor valida de nuevo",
          content: `Para validar tu nuevo email en la app tempo haz click aquí: ${validationURL}`,
        });
      } catch (error) {
        const emailError = new Error("Error en el envío del email");
        throw emailError;
      }

      await connection.query(
        `UPDATE customers
                SET name=?, email=?, picture=?, registration_code=?, update_date=UTC_TIMESTAMP(), active=false, last_auth_update=UTC_TIMESTAMP() 
                WHERE id=?
                `,
        [name, email, savedFileName, registrationCode, id]
      );
      // Dar una respuesta
      res.send({
        status: "ok",
        message: "Usuario actualizado. Mira tu email para activarlo de nuevo.",
      });
    } else {
      console.log("A ver si aquí me dices algo");
      await connection.query(
        `
                UPDATE customers
                SET name=?, email=?, picture=?
                WHERE id=?
                `,
        [name, email, savedFileName, id]
      );

      // Dar una respuesta
      res.send({
        status: "ok",
        message: "Usuario actualizado",
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editUser;
