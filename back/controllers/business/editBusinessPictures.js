const { getConnection } = require("../../db");
const {
	processAndSaveImage,
	generateError,
	showDebug,
} = require("../../helpers");

async function editBusinessPictures(req, res, next) {
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

		const images = [];
		if (pictures.length > 2) {
			if (req.files && Object.keys(req.files).length > 0) {
				for (const [imageName, imageData] of Object.entries(req.files).slice(
					0,
					3
				)) {
					try {
						await connection.query(
							`DELETE FROM pictures 
                        WHERE id_business = ?
                        ORDER BY id ASC limit 1               
                            `,
							[id]
						);
						showDebug(imageName);
						const processedImage = await processAndSaveImage(imageData);
						images.push(processedImage);
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
				pictures,
			});
		} else {
			if (req.files && Object.keys(req.files).length > 0) {
				for (const [imageName, imageData] of Object.entries(req.files).slice(
					0,
					3
				)) {
					try {
						showDebug(imageName);

						const processedImage = await processAndSaveImage(imageData);

						images.push(processedImage);

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
				pictures,
			});
		}
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
}

module.exports = editBusinessPictures;
