const { getConnection } = require("../../db");
const {
  randomString,
  sendMail,
  processAndSaveImage,
  generateError,
  formatDateToDB
} = require("../../helpers");
const { editUserSchema } = require("../../validators/userValidators");
const { differenceInYears } = require("date-fns");


async function editUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    // comprobar que se reciben todos los datos necesarios
    const { id } = req.params;
    const { name, surname, email, gender, birthday, city } = req.body;
    if (!email || !name || !surname || !gender || !birthday || !city) {
      throw generateError("Faltan datos para poder registrarte", 400);
    }


    //validar datos
    await editUserSchema.validateAsync(req.body);


    // comprobar que el id de usuario que queremos cambiar es
    // el mismo que firma la petición
    console.log(id, req.auth.id);

    if (req.auth.id !== Number(id)) {
      const error = new Error("No tienes permisos para editar este usuario");
      error.httpStatus = 403;
      throw error;
    }

    //comprobar que el usuario existe
    const [currentUser] = await connection.query(
      `SELECT id, email, picture
            FROM users
            WHERE id=?
            `,
      [id]
    );

    // comprobar que existe el usuario a editar
    if (currentUser.length === 0) {
      throw generateError(`El usuario con id ${id} no existe`, 404);
    }

    //verificar que la edad del usuario es mayor de 18
    const birthdayDate = new Date(birthday);
    const now = new Date();
    const age = differenceInYears(now, birthdayDate);
    if (age < 18) {
      throw generateError("Para registrarte debes ser mayor de 18 años", 400)
    }

    //Pasar la fecha de nacimiento a formato de base de datos
    const birthdayDateDB = formatDateToDB(birthdayDate);

    //guardar avatar si se manda imagen
    let savedFileName;
    if (req.files && req.files.picture) {
      try {
        //procesar y guardar imagen
        savedFileName = await processAndSaveImage(req.files.picture);
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
    if (email !== currentUser[0].email) {
      const [existingEmail] = await connection.query(
        `SELECT id
                FROM users
                WHERE email=?`,
        [email]
      );
      if (existingEmail.length > 0) {
        const error = new Error(
          "Ya existe un usuario con este email en la base de datos"
        );
        error.httpStatus = 403;
        throw error;
      }

      //verificar de nuevo el email recibido
      const registrationCode = randomString(40);
      const validationURL = `${process.env.PUBLIC_HOST}/user/validate/${registrationCode}`;

      // Enviar la url anterior por mail
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
        `UPDATE users
        SET name = ?, surname = ?, email=?, picture=?, gender=?, birthday=?, age=?, city=?, registration_code=?, update_date=UTC_TIMESTAMP, active=false, last_auth_update=UTC_TIMESTAMP 
        WHERE id=?
                `,
        [name, surname, email, savedFileName, gender, birthdayDateDB, age, city, registrationCode, id]
      );
      // Dar una respuesta
      res.send({
        status: "ok",
        message: "Usuario actualizado. Mira tu email para activarlo de nuevo.",
      });
    } else {
      await connection.query(
        `UPDATE users
          SET name = ?, surname = ?, email = ?, picture=?, gender=?, birthday=?, age=?, city=?, update_date=UTC_TIMESTAMP, last_auth_update=UTC_TIMESTAMP 
          WHERE id=?
                `,
        [name, surname, email, savedFileName, gender, birthdayDateDB, age, city, id]

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
