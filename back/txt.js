//.env UPLOADS_DIR=static/uploads

/* ++++++++++ DEFINIMOS RUTA PARA GUARDAR IMAGENES +++++++*/
const imageUploadPath = path.join(__dirname, process.env.UPLOADS_DIR);

/******* DEFINIMOS FUNCIÓN PARA SUBIDA DE FOTOGRAFÍAS *****/
async function processAndSaveImage(uploadedImage) {
	//CREAMOS EL DIRECTORIO RECURSIVO EN CASO DE SI HAY SÚBDIRECTORIOS
	await fs.mkdir(imageUploadPath, { recursive: true });

	// Leer la imagen que se subió
	const image = sharp(uploadedImage.data);

	//DEFINIMOS EL NOMBRE DE LA IMAGEN
	const imageFileName = `${uuid.v4()}.jpg`;

	//INTRODUCIMOS LA IMAGEN EN LA RUTA
	await image.toFile(path.join(imageUploadPath, imageFileName));

	//DEVOLVEMOS LA IMAGEN
	return imageFileName;
}

const { getConnection } = require("../db");
const { processAndSaveImage } = require("../helpers");

async function uploadPictures(req, res, next) {
	let connection;

	try {
		connection = await getConnection();

		const { id } = req.params;
		console.log(id);

		const [pictures] = await connection.query(
			`
        SELECT *
        FROM images_libro
        WHERE id_libro=?
        `,
			[id]
		);

		const images = [];
		if (pictures.length > 0) {
			await connection.query(
				`
            DELETE FROM images_libro 
            WHERE id_libro = ?`,
				[id]
			);
			if (req.files && Object.keys(req.files).length > 0) {
				for (const [imageName, imageData] of Object.entries(req.files).slice(
					0,
					3
				)) {
					try {
						console.log(imageName);
						const processedImage = await processAndSaveImage(imageData);
						images.push(processedImage);
						await connection.query(
							`INSERT INTO images_libro (picture, id_libro)
                            VALUES (?,?)`,
							[processedImage, id]
						);
					} catch (error) {
						console.log(error);
					}
				}
			}
			console.log(pictures);
			res.send({
				status: "oki doki",
				images,
			});
		} else {
			console.log("hola");
			if (req.files && Object.keys(req.files).length > 0) {
				console.log(req.files);
				for (const [imageName, imageData] of Object.entries(req.files).slice(
					0,
					3
				)) {
					try {
						console.log(imageName);

						const processedImage = await processAndSaveImage(imageData);

						images.push(processedImage);

						await connection.query(
							`
                        INSERT INTO images_libro (picture, id_libro)
                        VALUES (?,?)
                        `,
							[processedImage, id]
						);
					} catch (error) {
						console.log(error);
					}
				}
			}
			res.send({
				status: "oki doki",
				images,
			});
		}
	} catch (error) {
		next(error);
	}
}

module.exports = uploadPictures;
