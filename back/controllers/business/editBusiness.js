const { getConnection } = require("../../db");
const { generateError, processAndSaveImage, sendMail, } = require("../../helpers");
const { editBusinessSchema } = require("../../validators/businessValidators")


async function editBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();


    const { id } = req.params;

    const [currentData] = await connection.query(
      `
      SELECT id, email, profile_picture
      FROM business
            WHERE id=?
            `,
      [id]
    );
    const current = currentData[0].id;
    if (current !== req.auth.id) {
      throw generateError("No tienes permisos para editar este negocio", 403);
    }

    const {
      name,
      manager,
      category,
      email,
      openingTime,
      closingTime,
      lengthBooking,
      description,
      pricingList,
      bankAccount,
      allotment,
      zipCode,
      province,
      line1,
      line2,
      day1,
      day2,
      day3,
      day4,
      day5,
      day6,
      day7,
    } = req.body;

    //SI MANDAMOS IMAGEN GUARDAR AVATAR
    let savedFileName;
    if (req.files && req.files.profilePicture) {
      try {
        savedFileName = await processAndSaveImage(req.files.avatar);
      } catch (error) {
        throw generateError(
          "No se pudo procesar la imagen. Intentalo de nuevo", 400
        );
      }
    } else {
      savedFileName = currentData[0].image
    }

    if (email !== currentData[0].email) {
      const [existingEmail] = await connection.query(
        `
        SELECT id
        FROM users
        WHERE email=? 
      `,
        [email]
      );

      if (existingEmail.length > 0) {
        throw generateError(
          "Ya existe un usuario con este email en la base de datos",
          403
        );
      }
      const registrationCode = randomString(40);
      const validationURL = `${process.env.PUBLIC_HOST}/users/validate/${registrationCode}`;

      try {
        await sendMail({
          email,
          title:
            "Cambiaste tu email en la aplicación . Por favor valida de nuevo",
          content: `Para validar tu nuevo email en la app haz click aquí: ${validationURL}`,
        });
      } catch (error) {
        throw generateError("Error en el envío de mail", 500);

      }
    }




    //  await editBusinessSchema.validateAsync(req.body);
    await connection.query(
      `UPDATE business
       SET name =?,
       manager = ?,
       category = ?,
       email = ?,
       opening_time = ?,
       closing_time = ?,
       length_booking = ?,
       description = ?,
       pricing_list = ?,
       bank_account = ?,
       allotment_available = ?,
       allotment = ?,
       profile_picture = ?,
       zip_code = ?,
       province = ?,
       line1 = ?,
       line2 = ?,
       update_date = UTC_TIMESTAMP,
       last_auth_update = UTC_TIMESTAMP
       WHERE id = ?;     
      
      `,
      [
        name,
        manager,
        category,
        email,
        openingTime,
        closingTime,
        lengthBooking,
        description,
        pricingList,
        bankAccount,
        allotment,
        allotment,
        savedFileName,
        zipCode,
        province,
        line1,
        line2,
        id,
      ]
    );
    await connection.query(
      `DELETE FROM opening_days
      WHERE id_business= ?;
      `,
      [id]
    );

    await connection.query(
      `INSERT INTO opening_days ( id_business, day )
      VALUES (?, ?),
       (?, ?),
      (?, ?),
       (?, ?),
       (?, ?);
      `,
      [id, day1, id, day2, id, day3, id, day4, id, day5]
    );

    if (day6) {
      await connection.query(
        `INSERT INTO opening_days ( id_business, day )
      VALUES (?, ?)`,
        [id, day6]
      );
    }
    if (day7) {
      await connection.query(
        `INSERT INTO opening_days ( id_business, day )
      VALUES (?, ?)`,
        [id, day7]
      );
    }

    res.send({
      status: "usuario actualizado",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}
module.exports = editBusiness;
