const { getConnection } = require("../../db");
const { generateError, formatDateToDB } = require("../../helpers");



async function checkBusinessAvailability(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { idBusiness } = req.params;
    const { checkInDay } = req.query;

    const [infoBusiness] = await connection.query(`
    SELECT opening_time, closing_time, allotment, length_booking
    FROM business
    WHERE id=?`,
      [idBusiness]);

    const allotment = infoBusiness[0].allotment;
    const openingTime = infoBusiness[0].opening_time;
    const closingTime = infoBusiness[0].closing_time;
    const lengthBooking = infoBusiness[0].length_booking;
    if (req.auth.id !== Number(idBusiness)) {
      throw generateError("No tienes permisos para acceder a las reservas de otro negocio", 403);
    }




    const now = new Date();

    if (checkInDay) {
      const checkInDayJS = new Date(checkInDay);

      const checkInDayDB = formatDateToDB(checkInDayJS);

      if (lengthBooking === 30) {
        let iPlusLength = 0.5;
        const [result] = await connection.query(`
        select check_in_day, HOUR(check_in_time) as check_in_time, MINUTE(check_in_time) as minutes, COUNT(BO.id) AS bookings, 
        BU.allotment_available AS allotment, COUNT(BO.id)/BU.allotment_available * 100 as occ 
        FROM business BU, booking BO
        WHERE BU.id = BO.id_business AND BU.id=? AND check_in_day = ? AND NOT BO.status = 'CANCELADO' 
        GROUP BY check_in_day, check_in_time;`,
          [idBusiness, checkInDayDB])
        const bookingTimes = []

        for (let i = Number(openingTime); i < closingTime; i += iPlusLength) {
          if (Number.isInteger(i)) {
            const current = result.find(r => r.check_in_time === i);
            if (current) {
              bookingTimes.push(current)
            }
            else {
              bookingTimes.push({
                "check_in_day": checkInDayDB,
                "check_in_time": i,
                "minutes": "00",
                "bookings": 0,
                "allotment": allotment,
                "occ": "00.0000"
              })
            }
          } else {
            let hour = i - iPlusLength;
            const current = result.find(r => r.check_in_time === hour && r.minutes === iPlusLength);
            if (current) {
              bookingTimes.push(current)
            }
            else {
              bookingTimes.push({
                "check_in_day": checkInDayDB,
                "check_in_time": hour,
                "minutes": lengthBooking,
                "bookings": 0,
                "allotment": allotment,
                "occ": "00.0000"
              })
            }
          }
        }
        const totalBookings = bookingTimes.reduce((accumulator, slotTime) => {
          return accumulator + slotTime.bookings;
        }, 0);
        const totalAvailable = bookingTimes.reduce((accumulator, slotTime) => {
          return accumulator + slotTime.allotment;
        }, 0);
        const occupancy = (totalBookings / totalAvailable).toFixed(2) * 100;

        const summaryDaily = {
          "day": checkInDayDB,
          "totalBookings": totalBookings,
          "totalAvailable": totalAvailable,
          "occ": occupancy
        }

        // mando la respuesta
        res.send({
          status: "ok",
          data: bookingTimes,
          summary: summaryDaily,

        });
      } else {
        const [result] = await connection.query(`
        select check_in_day, HOUR(check_in_time) as check_in_time, COUNT(BO.id) AS bookings, 
        BU.allotment_available AS allotment, COUNT(BO.id)/BU.allotment_available * 100 as occ 
        FROM business BU, booking BO
        WHERE BU.id = BO.id_business AND BU.id=? AND check_in_day = ? AND NOT BO.status = 'CANCELADO' 
        GROUP BY check_in_day, check_in_time;`,
          [idBusiness, checkInDayDB])
        const bookingTimes = []

        for (let i = Number(openingTime); i < closingTime; i++) {
          const current = result.find(r => r.check_in_time === i);
          if (current) {
            bookingTimes.push(current)
            console.log();
          }
          else {
            bookingTimes.push({
              "check_in_day": checkInDayDB,
              "check_in_time": i,
              "minutes": "00",
              "bookings": 0,
              "allotment": allotment,
              "occ": "00.0000"
            })
          }
        }
        const totalBookings = bookingTimes.reduce((accumulator, slotTime) => {
          return accumulator + slotTime.bookings;
        }, 0);
        const totalAvailable = bookingTimes.reduce((accumulator, slotTime) => {
          return accumulator + slotTime.allotment;
        }, 0);
        const occupancy = (totalBookings / totalAvailable).toFixed(2) * 100;

        const summaryDaily = {
          "day": checkInDayDB,
          "totalBookings": totalBookings,
          "totalAvailable": totalAvailable,
          "occ": occupancy
        }

        // mando la respuesta
        res.send({
          status: "ok",
          data: bookingTimes,
          summary: summaryDaily,

        });
      }
    }
    else {
      const todayDB = formatDateToDB(now);
      if (lengthBooking === 30) {
        let iPlusLength = 0.5;
        const [result] = await connection.query(`
        select check_in_day, HOUR(check_in_time) as check_in_time, MINUTE(check_in_time) as minutes, COUNT(BO.id) AS bookings, 
        BU.allotment_available AS allotment, COUNT(BO.id)/BU.allotment_available * 100 as occ 
        FROM business BU, booking BO
        WHERE BU.id = BO.id_business AND BU.id=? AND check_in_day = ? AND NOT BO.status = 'CANCELADO' 
        GROUP BY check_in_day, check_in_time;`,
          [idBusiness, todayDB])
        const bookingTimes = []

        for (let i = Number(openingTime); i < closingTime; i += iPlusLength) {
          if (Number.isInteger(i)) {
            const current = result.find(r => r.check_in_time === i);
            if (current) {
              bookingTimes.push(current)
            }
            else {
              bookingTimes.push({
                "check_in_day": todayDB,
                "check_in_time": i,
                "minutes": "00",
                "bookings": 0,
                "allotment": allotment,
                "occ": "00.0000"
              })
            }
          } else {
            let hour = i - iPlusLength;
            const current = result.find(r => r.check_in_time === hour && r.minutes === iPlusLength);
            if (current) {
              bookingTimes.push(current)
            }
            else {
              bookingTimes.push({
                "check_in_day": todayDB,
                "check_in_time": hour,
                "minutes": lengthBooking,
                "bookings": 0,
                "allotment": allotment,
                "occ": "00.0000"
              })
            }
          }
        }

        const totalBookings = bookingTimes.reduce((accumulator, slotTime) => {
          return accumulator + slotTime.bookings;
        }, 0);
        const totalAvailable = bookingTimes.reduce((accumulator, slotTime) => {
          return accumulator + slotTime.allotment;
        }, 0);
        const occupancy = (totalBookings / totalAvailable).toFixed(2) * 100;

        const summaryDaily = {
          "day": todayDB,
          "totalBookings": totalBookings,
          "totalAvailable": totalAvailable,
          "occ": occupancy
        }

        // mando la respuesta
        res.send({
          status: "ok",
          data: bookingTimes,
          summary: summaryDaily,

        });




      } else {
        const [result] = await connection.query(`
        select check_in_day, HOUR(check_in_time) as check_in_time, MINUTE(check_in_time) as minutes, COUNT(BO.id) AS bookings, 
        BU.allotment_available AS allotment, COUNT(BO.id)/BU.allotment_available * 100 as occ 
        FROM business BU, booking BO
      WHERE BU.id = BO.id_business AND BU.id=? AND check_in_day = ? AND NOT BO.status = 'CANCELADO' 
      GROUP BY check_in_day, check_in_time;`,
          [idBusiness, todayDB])
        const bookingTimes = []

        for (let i = Number(openingTime); i < closingTime; i++) {
          const current = result.find(r => r.check_in_time === i);
          if (current) {
            bookingTimes.push(current)
          }
          else {
            bookingTimes.push({
              "check_in_day": todayDB,
              "check_in_time": i,
              "minutes": "00",
              "bookings": 0,
              "allotment": allotment,
              "occ": "00.0000"
            })
          }
        }

        const totalBookings = bookingTimes.reduce((accumulator, slotTime) => {
          return accumulator + slotTime.bookings;
        }, 0);
        const totalAvailable = bookingTimes.reduce((accumulator, slotTime) => {
          return accumulator + slotTime.allotment;
        }, 0);
        const occupancy = (totalBookings / totalAvailable).toFixed(2) * 100;

        const summaryDaily = {
          "day": todayDB,
          "totalBookings": totalBookings,
          "totalAvailable": totalAvailable,
          "occ": occupancy
        }
        // mando la respuesta
        res.send({
          status: "ok",
          data: bookingTimes,
          summary: summaryDaily,
        });
      }
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = checkBusinessAvailability;
