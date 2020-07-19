const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");
const { editBusinessSchema } = require("../../validators/businessValidators")


async function editBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    await editBusinessSchema.validateAsync(req.body);

    const { id } = req.params;

    const [currentData] = await connection.query(
      `
            SELECT id
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
      openingTime,
      closingTime,
      lengthBooking,
      description,
      bankAccount,
      allotment,
      profilePicture,
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

    await connection.query(
      `UPDATE business
       SET opening_time = ?,
       closing_time = ?,
       length_booking = ?,
       description = ?,
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
        openingTime,
        closingTime,
        lengthBooking,
        description,
        bankAccount,
        allotment,
        allotment,
        profilePicture,
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
