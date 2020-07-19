const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function activateBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { idBusiness } = req.params;
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
    const province = result[0].province;
    const line1 = result[0].line1;
    const line2 = result[0].line2;
    const status = result[0].status;
    const day3 = result[2].day;

    if (status === "ACTIVO") {
      throw generateError(
        "No se puede activar el negocio porque ya está activo",
        401
      );
    }
    if (status === "CERRADO_BY_ADMIN") {
      throw generateError(
        "El negocio fue cerrado por el administrador. Verificar las causas y seguir la ruta correcta para activar el negocio",
        401
      );
    }
    if (status === "SIN_VALIDAR") {
      throw generateError("El negocio todavía no ha sido validado");
    }

    if (
      !openingTime ||
      !closingTime ||
      !lengthBooking ||
      !description ||
      !bankAccount ||
      !allotment ||
      !profilePicture ||
      !zipCode ||
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
            SET status="ACTIVO", registration_code=NULL, update_date=UTC_TIMESTAMP, last_auth_update=UTC_TIMESTAMP
            WHERE id=?
            `,
      [idBusiness]
    );
    res.send({
      status: "ok",
      message:
        "Has activado el nuevo negocio, comenzará a recibir reservas en breve",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = activateBusiness;
