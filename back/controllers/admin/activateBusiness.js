const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function activateBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { idBusiness } = req.params;
    const { newStatus } = req.body
    //comprobamos que el código de registro es el correcto
    const [result] = await connection.query(
      `
            SELECT B.id, opening_time,
            closing_time,
            length_booking,
            description,
            bank_account,
            allotment,
            profile_picture,
            zip_code,
            city,
            province,
            line1,
            line2,
            update_date,
            last_auth_update,
            registration_code,
            status,
            OD.day
            FROM business B LEFT OUTER JOIN opening_days OD ON B.id = OD.id_business
            WHERE B.id = ?
            GROUP BY B.id, OD.day;;
            `,
      [idBusiness]
    );

    const openingTime = result[0].opening_time;
    const closingTime = result[0].closing_time;
    const lengthBooking = result[0].length_booking;
    const description = result[0].description;
    const bankAccount = result[0].bank_account;
    const allotment = result[0].allotment;
    const profilePicture = result[0].profile_picture;
    const zipCode = result[0].zip_code;
    const city = result[0].city;
    const province = result[0].province;
    const line1 = result[0].line1;
    const line2 = result[0].line2;
    const day3 = result[2].day;

    if (
      !openingTime ||
      !closingTime ||
      !lengthBooking ||
      !description ||
      !bankAccount ||
      !allotment ||
      !profilePicture ||
      !zipCode ||
      !city ||
      !province ||
      !line1 ||
      !line2 ||
      !day3
    ) {
      throw generateError(
        "No puedes activar este usuario porque le faltan datos necesarios"
      );
    }

    //actualizar la tabla de usuarios marcando como activo
    //el usuario que tenga el código recibido
    await connection.query(
      `UPDATE business
            SET status=?, registration_code=NULL, update_date=UTC_TIMESTAMP, last_auth_update=UTC_TIMESTAMP
            WHERE id=?
            `,
      [newStatus, idBusiness]
    );
    res.send({
      status: "ok",
      message:
        "El estado del negocio se ha cambiado satisfactoriamente",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = activateBusiness;
