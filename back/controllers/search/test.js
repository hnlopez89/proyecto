const { getConnection } = require("../db");
const { generateError } = require("../helpers");

async function search(req, res, next) {
	let connection;
	try {
		connection = await getConnection();

		//OBTENER CRITERIOS DE BÚSQUEDA DE USUARIO
		const { isbn, titulo, precio1, precio2, order, direction } = req.query;
		let query = "select * from libro";

		//ESTABLECER ORDEN Y SENTIDO DE BÚSQUEDA
		const orderDirection =
			(direction && direction.toLowerCase()) === "asc" ? "ASC" : "DESC";
		let orderBy;
		switch (order) {
			case "precio":
				orderBy = "precio";
				break;
			case "creationDate":
				orderBy = "creation_date";
				break;
			default:
				orderBy = "creation_date";
		}

		//ESTABLECEMOS PARAMETROS DE BÚSQUEDA
		const params = [];

		//REALIZAR QUERY MULTIBÚSQUEDA SI TENEMOS VARIABLES
		if (isbn || titulo || (precio1 && precio2)) {
			//ESTABLECEMOS CONDICIONES PARA LA QUERY
			const conditions = [];
			if (isbn) {
				conditions.push(`isbn =?`);
				params.push(`${isbn}`);
			}
			if (titulo) {
				conditions.push(`titulo LIKE ?`);
				params.push(`%${titulo}%`);
			}
			if (precio1 && precio2) {
				conditions.push(`precio BETWEEN ? AND ?`);
				params.push(`${precio1}`, `${precio2}`);
			}

			query = `${query} WHERE ${conditions.join(
				` AND `
			)} ORDER BY ${orderBy} ${orderDirection}`;
			console.log(query, params);
			const [result] = await connection.query(query, params);

			res.send({
				data: result,
			});
		}
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
}

module.exports = search;
