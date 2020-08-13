const { getConnection } = require("../../db");

async function getBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;
    const [result] = await connection.query(
      `
            SELECT id,
            name,
            manager,
            category,
            email,
            opening_time,
            closing_time,
            length_booking,
            description,
            pricing_list,
            bank_account,
            allotment_available,
            allotment,
            profile_picture,
            city,
            zip_code,
            province,
            line1,
            line2,
            status
            FROM business
            WHERE id=?
            `,
      [id]
    );

    const [openDays] = await connection.query(
      `
        SELECT *
        FROM opening_days
        WHERE id_business=?
      `,
      [id]
    );
    if (result.length === 0) {
      const error = new Error(`El negocio con id${id} no existe`);
      error.httpStatus = 404;
      throw error;
    }

    const [businessData] = result;

    const responseData = {
      registrationDate: businessData.registrationDate,
      name: businessData.name,
    };

    if (businessData.id === req.auth.id) {
      responseData.email = businessData.email;
    }

    res.send({
      status: "ok",
      data: result,
      openDays: openDays
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getBusiness;
