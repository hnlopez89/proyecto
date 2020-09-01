const { getConnection } = require("../../db");

async function viewTopBusiness(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const [topData] = await connection.query(
      `
            SELECT B.id,name,
            manager,
            category,
            opening_time,
            closing_time,
            description,
            profile_picture,
            city,
            length_booking,
            zip_code,
            province,
            line1,
            line2,
            B.creating_date,
            (SELECT AVG(rating)
            FROM booking
            WHERE id_business = B.id) AS vote_average,
            (SELECT COUNT(rating)
            FROM booking
            WHERE id_business = B.id) AS count
            FROM business B LEFT JOIN booking
            ON id_business = B.id
            WHERE B.status = 'ACTIVO'
            GROUP BY B.id
            ORDER BY vote_average DESC limit 1
            `,
    );
    const [popularData] = await connection.query(
      `
            SELECT B.id,name,
            manager,
            category,
            opening_time,
            closing_time,
            description,
            profile_picture,
            city,
            length_booking,
            zip_code,
            province,
            line1,
            line2,
            B.creating_date,
            (SELECT AVG(rating)
            FROM booking
            WHERE id_business = B.id) AS vote_average,
            (SELECT COUNT(rating)
            FROM booking
            WHERE id_business = B.id) AS count
            FROM business B LEFT JOIN booking
            ON id_business = B.id
            WHERE B.status = 'ACTIVO'
            GROUP BY B.id
            ORDER BY count DESC limit 1
            `,
    );

    const [newestData] = await connection.query(
      `
            SELECT B.id,name,
            manager,
            category,
            opening_time,
            closing_time,
            description,
            profile_picture,
            city,
            length_booking,
            zip_code,
            province,
            line1,
            line2,
            B.creating_date,
            (SELECT AVG(rating)
            FROM booking
            WHERE id_business = B.id) AS vote_average,
            (SELECT COUNT(rating)
            FROM booking
            WHERE id_business = B.id) AS count
            FROM business B LEFT JOIN booking
            ON id_business = B.id
            WHERE B.status = 'ACTIVO'
            GROUP BY B.id
            ORDER BY creating_date DESC limit 1
            `,
    );

    const top = topData[0];
    const popular = popularData[0];
    const newest = newestData[0];

    res.send({
      status: "ok",
      top,
      popular,
      newest,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = viewTopBusiness;
