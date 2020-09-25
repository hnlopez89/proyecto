const { getYear, getMonth } = require("date-fns");
const { getConnection } = require("../../db");
const { generateError, formatDateToDB, daysInMonth } = require("../../helpers");



async function checkBusinessAvailabilityMonthly(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { idBusiness } = req.params;
    const { checkInMonth } = req.query;
    console.log(checkInMonth);
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

    const date = new Date();
    const monthByDefault = getMonth(date);
    const year = getYear(date);
    const checkDaysMonth = Number(checkInMonth) + 1;
    const daysMonth = daysInMonth(checkDaysMonth, year);
    const monthByDefaultToDays = Number(monthByDefault) + 1;
    const daysMonthDefault = daysInMonth(monthByDefaultToDays, year)

    const monthTimes = []
    let bookingTimes = []


    if (checkInMonth) {

      for (let j = 1; j <= daysMonth; j++) {
        date.setMonth(checkInMonth);
        date.setDate((j + 1));
        let checkInDayDB = formatDateToDB(date);

        if (lengthBooking === 30) {
          let iPlusLength = 0.5;


          const [isOpen] = await connection.query(`
          SELECT name
          FROM business BU LEFT OUTER JOIN opening_days OD ON BU.id = OD.id_business
          WHERE BU.id = ?
          AND (WEEKDAY(?)+1) IN (SELECT day FROM opening_days OD WHERE OD.id_business = BU.ID)
          group bY name`,
            [idBusiness, checkInDayDB]);

          if (isOpen.length > 0) {
            const [result] = await connection.query(`
          select check_in_day, HOUR(check_in_time) as check_in_time, MINUTE(check_in_time) as minutes, COUNT(BO.id) AS bookings, 
              BU.allotment_available AS allotment, CONCAT(COUNT(BO.id)/BU.allotment_available * 100, '%') as occ 
              FROM business BU, booking BO
              WHERE BU.id = BO.id_business AND BU.id=? AND check_in_day = ? AND NOT BO.status = 'CANCELADO'
              GROUP BY check_in_day, check_in_time;`,
              [idBusiness, checkInDayDB])

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
                    "occ": "00.0000%"
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
                    "occ": "00.0000%"
                  })
                }
              }
            }
            let totalBookings = bookingTimes.reduce((accumulator, slotTime) => {
              return accumulator + slotTime.bookings;
            }, 0);
            let totalAvailable = bookingTimes.reduce((accumulator, slotTime) => {
              return accumulator + slotTime.allotment;
            }, 0);
            let occupancy = (totalBookings / totalAvailable).toFixed(2) * 100 + "%";

            let summaryDaily = {
              "day": checkInDayDB,
              "totalBookings": totalBookings,
              "totalAvailable": totalAvailable,
              "occ": occupancy
            }
            monthTimes.push(summaryDaily)
            bookingTimes = []
          }
        }

        else {

          const [isOpen] = await connection.query(`
          SELECT name
          FROM business BU LEFT OUTER JOIN opening_days OD ON BU.id = OD.id_business
          WHERE BU.id = ?
          AND (WEEKDAY(?)+1) IN (SELECT day FROM opening_days OD WHERE OD.id_business = BU.ID)
          group bY name`,
            [idBusiness, checkInDayDB]);

          if (isOpen.length > 0) {
            const [result] = await connection.query(`
                    select check_in_day, HOUR(check_in_time) as check_in_time, COUNT(BO.id) AS bookings, 
                    BU.allotment_available AS allotment, CONCAT(COUNT(BO.id)/BU.allotment_available * 100, '%') as occ 
                    FROM business BU, booking BO
                    WHERE BU.id = BO.id_business AND BU.id=? AND check_in_day = ? AND NOT BO.status = 'CANCELADO' 
                    GROUP BY check_in_day, check_in_time;`,
              [idBusiness, checkInDayDB])

            for (let i = Number(openingTime); i < closingTime; i++) {
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
                  "occ": "00.0000%"
                })
              }
            }
            const totalBookings = bookingTimes.reduce((accumulator, slotTime) => {
              return accumulator + slotTime.bookings;
            }, 0);
            const totalAvailable = bookingTimes.reduce((accumulator, slotTime) => {
              return accumulator + slotTime.allotment;
            }, 0);
            const occupancy = (totalBookings / totalAvailable).toFixed(2) * 100 + "%";

            const summaryDaily = {
              "day": checkInDayDB,
              "totalBookings": totalBookings,
              "totalAvailable": totalAvailable,
              "occ": occupancy
            }
            monthTimes.push(summaryDaily)
            bookingTimes = []

          }
          // mando la respuesta
        }
      }
      const totalBookings = monthTimes.reduce((accumulator, slotTime) => {
        return accumulator + slotTime.totalBookings;
      }, 0);
      const totalAvailable = monthTimes.reduce((accumulator, slotTime) => {
        return accumulator + slotTime.totalAvailable;
      }, 0);
      const occupancy = (totalBookings / totalAvailable).toFixed(2) * 100 + "%";

      const summaryMonthly = {
        "month": checkDaysMonth,
        "totalBookings": totalBookings,
        "totalAvailable": totalAvailable,
        "occ": occupancy
      }


      res.send({
        status: "ok",
        data: monthTimes,
        summary: summaryMonthly
      });
    }
    else {

      for (let j = 1; j <= daysMonthDefault; j++) {
        date.setMonth(monthByDefault);
        date.setDate((j + 1));
        let checkInDayDB = formatDateToDB(date);


        if (lengthBooking === 30) {
          let iPlusLength = 0.5;

          const [isOpen] = await connection.query(`
          SELECT name
          FROM business BU LEFT OUTER JOIN opening_days OD ON BU.id = OD.id_business
          WHERE BU.id = ?
          AND (WEEKDAY(?)+1) IN (SELECT day FROM opening_days OD WHERE OD.id_business = BU.ID)
          group bY name`,
            [idBusiness, checkInDayDB]);

          if (isOpen.length > 0) {
            const [result] = await connection.query(`
                  select check_in_day, HOUR(check_in_time) as check_in_time, MINUTE(check_in_time) as minutes, COUNT(BO.id) AS bookings, 
                  BU.allotment_available AS allotment, CONCAT(COUNT(BO.id)/BU.allotment_available * 100, '%') as occ 
                  FROM business BU, booking BO
                  WHERE BU.id = BO.id_business AND BU.id=? AND check_in_day = ? AND NOT BO.status = 'CANCELADO' 
                  GROUP BY check_in_day, check_in_time;`,
              [idBusiness, checkInDayDB])

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
                    "occ": "00.0000%"
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
                    "occ": "00.0000%"
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
            const occupancy = (totalBookings / totalAvailable).toFixed(2) * 100 + "%";

            let summaryDaily = {
              "day": checkInDayDB,
              "totalBookings": totalBookings,
              "totalAvailable": totalAvailable,
              "occ": occupancy
            }
            monthTimes.push(summaryDaily)
            bookingTimes = []


          }
        } else {

          const [isOpen] = await connection.query(`
          SELECT name
          FROM business BU LEFT OUTER JOIN opening_days OD ON BU.id = OD.id_business
          WHERE BU.id = ?
          AND (WEEKDAY(?)+1) IN (SELECT day FROM opening_days OD WHERE OD.id_business = BU.ID)
          group bY name`,
            [idBusiness, checkInDayDB]);

          if (isOpen.length > 0) {

            const [result] = await connection.query(`
                  select check_in_day, HOUR(check_in_time) as check_in_time, MINUTE(check_in_time) as minutes, COUNT(BO.id) AS bookings, 
                  BU.allotment_available AS allotment, CONCAT(COUNT(BO.id)/BU.allotment_available * 100, '%') as occ 
                  FROM business BU, booking BO
                WHERE BU.id = BO.id_business AND BU.id=? AND check_in_day = ? AND NOT BO.status = 'CANCELADO' 
                GROUP BY check_in_day, check_in_time;`,
              [idBusiness, checkInDayDB])

            for (let i = Number(openingTime); i < closingTime; i++) {
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
                  "occ": "00.0000%"
                })
              }
            }

            const totalBookings = bookingTimes.reduce((accumulator, slotTime) => {
              return accumulator + slotTime.bookings;
            }, 0);
            const totalAvailable = bookingTimes.reduce((accumulator, slotTime) => {
              return accumulator + slotTime.allotment;
            }, 0);
            const occupancy = (totalBookings / totalAvailable).toFixed(2) * 100 + "%";

            const summaryDaily = {
              "day": checkInDayDB,
              "totalBookings": totalBookings,
              "totalAvailable": totalAvailable,
              "occ": occupancy
            }
            monthTimes.push(summaryDaily)
            bookingTimes = []


          }
        }
      }
      const totalBookings = monthTimes.reduce((accumulator, slotTime) => {
        return accumulator + slotTime.totalBookings;
      }, 0);
      const totalAvailable = monthTimes.reduce((accumulator, slotTime) => {
        return accumulator + slotTime.totalAvailable;
      }, 0);
      const occupancy = (totalBookings / totalAvailable).toFixed(2) * 100 + "%";

      const summaryMonthly = {
        "month": monthByDefaultToDays,
        "totalBookings": totalBookings,
        "totalAvailable": totalAvailable,
        "occ": occupancy
      }

      // mando la respuesta
      res.send({
        status: "ok",
        data: monthTimes,
        summary: summaryMonthly
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = checkBusinessAvailabilityMonthly;
