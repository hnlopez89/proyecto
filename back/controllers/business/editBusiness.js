const { getConnection } = require("../../db");
const {
  processAndSaveImage,
  generateError,
  showDebug,
} = require("../../helpers");

async function editBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
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
    const [pictures] = await connection.query(
      `SELECT id
        FROM pictures
        WHERE id_business=?`,
      [id]
    );
    if (pictures.length >= 3) {
      throw generateError(
        "No puedes subir más fotos, borra alguna primero",
        406
      );
    }

    const images = [];

    if (req.files && Object.keys(req.files).length > 0) {
      for (const [imageName, imageData] of Object.entries(req.files).slice(
        0,
        3
      )) {
        try {
          showDebug(imageName);

          const processedImage = await processAndSaveImage(imageData);

          images.push(processedImage);

          console.log(processedImage, "holi", id);

          await connection.query(
            `INSERT INTO pictures (update_date, id_business, picture)
            VALUES (UTC_TIMESTAMP, ?, ?)
            `,
            [id, processedImage]
          );
        } catch (error) {
          throw generateError("No se pudo procesar la imagen", 400);
        }
      }
    }
    res.send({
      status: "oki doki",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}
module.exports = editBusiness;
