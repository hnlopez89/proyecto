const { getConnection } = require("../../db");
const { randomString, sendMail, generateError, formatDateToDB } = require("../../helpers");
const { newUserSchema } = require("../../validators/userValidators");
const { differenceInYears } = require("date-fns");

async function newUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    await newUserSchema.validateAsync(req.body);
    const { name, surname, email, password, gender, birthday, city } = req.body;

    // comprobar que se reciben todos los datos necesarios
    if (!email || !password || !name || !surname || !password || !gender || !birthday || !city) {
      throw generateError("Faltan datos para poder registrarte", 400);
    }

    //comprobar que no existe un usuario con ese mismo email en la base de datos
    const [existingUser] = await connection.query(
      `
            SELECT id
            FROM users
            WHERE email =?
            `,
      [email]
    );
    if (existingUser.length > 0) {
      const error = new Error(
        "Ya existe un usuario en la base de datos con ese email"
      );
      error.httpStatus = 409;
      throw error;
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

    // enviar un mensaje de confirmación de registro al email indicador
    const registrationCode = randomString(40);
    const validationURL = `${process.env.PUBLIC_HOST}/user/validation/${registrationCode}`;

    //Enviar la url anterior por mail
    try {
      await sendMail({
        email,
        title: "Valida tu cuenta de usuario en la app Tempo",
        content: `Para validar tu cuenta de usuario en la app haz click aquí: ${validationURL}`,
      });
    } catch (error) {
      const emailError = new Error("Error en el envío de mail");
      throw emailError;
    }

    // meter el nuevo usuario en la base de datos sin activar
    await connection.query(
      `INSERT INTO users(name, surname, email, password, gender, birthday, age, city, creating_date, update_date, last_auth_update, registration_code )
      VALUES(?, ?, ?, SHA2(?,512), ?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP(), UTC_TIMESTAMP(), ? )
            `,
      [name, surname, email, password, gender, birthdayDateDB, age, city, registrationCode]
    );
    res.send({
      status: "ok",
      message:
        "Usuario registrado. Mira tu email para activarlo. Mira en la carpeta de SPAM si no lo encuentras",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newUser;
