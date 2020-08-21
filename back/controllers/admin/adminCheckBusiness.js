const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function checkBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    //SELECCIONAMOS TODA LA INFO NECESARIA PARA QUE
    // EL NEGOCIO PUEDA SER ACTIVADO
    const { idBusiness } = req.params;
    console.log(idBusiness);
    const [businessData] = await connection.query(
      `
            SELECT *
            FROM business 
            WHERE id = ?
            `,
      [idBusiness]
    );
    const [openingDays] = await connection.query(
      `
            SELECT id_business, day
            FROM opening_days
            WHERE id_business=?
            `,
      [idBusiness]
    );

    if (businessData.length === 0 || openingDays.length === 0) {
      throw generateError("Te faltan datos por rellenar", 404);
    }

    res.send({
      status: "ok",
      businessData,
      openingDays
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = checkBusiness;
