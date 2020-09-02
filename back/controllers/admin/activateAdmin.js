const { getConnection } = require("../../db");
const {
    generateError,
} = require("../../helpers");



async function editUser(req, res, next) {
    let connection;
    try {
        connection = await getConnection();

        // comprobar que se reciben todos los datos necesarios
        const { idAdmin, idUser } = req.params;
        const { role, active, resignReason } = req.body;

        // comprobar que el id de usuario es el que firma la petición
        // y que es administrador
        if (req.auth.id !== Number(idAdmin) || req.auth.role !== "admin") {
            const error = new Error("No tienes permisos para editar este usuario");
            error.httpStatus = 403;
            throw error;
        }

        //comprobar que el usuario existe
        const [currentUser] = await connection.query(
            `SELECT id, email, picture
            FROM users
            WHERE id=?
            `,
            [idUser]
        );

        // comprobar que existe el usuario a editar
        if (currentUser.length === 0) {
            throw generateError(`El usuario con id ${idUser} no existe`, 404);
        }

        //actualizar permisos del usuario si así se requiere
        if (role) {
            await connection.query(
                `UPDATE users
            SET  update_date=UTC_TIMESTAMP, role=?, last_auth_update=UTC_TIMESTAMP 
            WHERE id=?
                    `,
                [role, idUser]
            );

            // Dar una respuesta
            res.send({
                status: "ok",
                message: "Usuario actualizado. Tiene permisos de administrador.",
            });
        }

        if (active && resignReason) {
            await connection.query(
                `UPDATE users
            SET  update_date=UTC_TIMESTAMP, active=?, resign_reason=?, last_auth_update=UTC_TIMESTAMP 
            WHERE id=?
                    `,
                [active, resignReason, idUser]
            );

            // Dar una respuesta
            res.send({
                status: "ok",
                message: "Usuario actualizado.",
            });
        }

    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
}

module.exports = editUser;
