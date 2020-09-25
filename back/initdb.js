require("dotenv").config();


//MODULOS CON LOS QUE VAMOS A TRABAJAR
//PRINCIPALMENTE PARA POBLAR LA BASE DE DATOS
const faker = require("faker/locale/es");
const { getConnection } = require("./db");
const { formatDateToDB, formatDateTimeToDB, minutesToDB } = require("./helpers");
const { random } = require("lodash");
const { addMinutes } = require("date-fns");


let connection;

async function main() {
  try {
    // Conseguir conexión a la base de datos
    connection = await getConnection();

    // Borrar las tablas si existen (diary, diary_votes)
    console.log("Borrando tablas");
    await connection.query("DROP VIEW IF EXISTS business_details CASCADE");
    await connection.query("DROP TABLE IF EXISTS opening_days CASCADE");
    await connection.query("DROP TABLE IF EXISTS pictures CASCADE");
    await connection.query("DROP TABLE IF EXISTS booking CASCADE");
    await connection.query("DROP TABLE IF EXISTS users CASCADE");
    await connection.query("DROP TABLE IF EXISTS business CASCADE");

    // Crear las tablas de nuevo
    console.log("Creando tablas");

    await connection.query(`
    CREATE TABLE users(
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      role ENUM ('customer' , 'admin') DEFAULT 'customer' NOT NULL,
      name VARCHAR(50) NOT NULL,
      surname VARCHAR(50) NOT NULL,
      email VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(500) NOT NULL,
      telephone VARCHAR(20) NOT NULL,
      gender ENUM ('VARON', 'MUJER'),
      birthday DATE,
      age INT,
      province VARCHAR(50),
      picture VARCHAR(80),
      resign_reason VARCHAR(100),
      creating_date TIMESTAMP NOT NULL,
      update_date DATETIME NOT NULL,
      active BOOLEAN DEFAULT false,
      registration_code TINYTEXT,
      last_auth_update DATETIME NOT NULL
      );
    `);
    console.log("Creando admin");
    //poblamos tabla de usuarios
    await connection.query(
      `INSERT INTO users(
        role,
        name,
        surname,
        email,
        password,
        telephone,
        gender,
        birthday,
        age,
        creating_date,
        update_date,
        last_auth_update,
        active
        )
        VALUES (
          'admin',
        "Hugo",
        "Nogueira",
        "esehugo@hotmail.com",
        SHA2("loremipsum", 512),
        652200931,
        "VARON",
        "1989/06/29",
        "31",
        UTC_TIMESTAMP,
        UTC_TIMESTAMP,
        UTC_TIMESTAMP,
        1
        )
      `
    );
    console.log("Poblando users");

    const users = 100;
    const genders = ["VARON", "MUJER"];
    const telephone = faker.phone.phoneNumber();
    const provinces = ["Alava",
      "Albacete",
      "Alicante",
      "Almeria",
      "Asturias",
      "Avila",
      "Badajoz",
      "Barcelona",
      "Burgos",
      "Caceres",
      "Cadiz",
      "Cantabria",
      "Castellon",
      "Ceuta",
      "Ciudad_real",
      "Cordoba",
      "Cuenca",
      "Girona",
      "Granada",
      "Guadalajara",
      "Guipuzcoa",
      "Huelva",
      "Huesca",
      "Islas_Baleares",
      "Jaen",
      "La_coruña",
      "La_rioja",
      "Las_palmas",
      "Leon",
      "Lleida",
      "Lugo",
      "Madrid",
      "Malaga",
      "Melilla",
      "Murcia",
      "Navarra",
      "Ourense",
      "Palencia",
      "Pontevedra",
      "Salamanca",
      "Segovia",
      "Sevilla",
      "Soria",
      "Tarragona",
      "Santa_cruz_de_Tenerife",
      "Teruel",
      "Toledo",
      "Valencia",
      "Valladolid",
      "Vizcaya",
      "Zamora",
      "Zaragoza"];
    for (let index = 0; index < users; index++) {
      const name = faker.name.firstName();
      const surname = faker.name.lastName();
      const genderIndex = Math.floor(Math.random() * genders.length);
      const gender = genders[genderIndex];
      const birthday = faker.date.past();
      const birthdayDB = formatDateToDB(birthday)
      const age = random(18, 75);
      const emailAddress = faker.internet.email();
      const provinceIndex = Math.floor(Math.random() * provinces.length);
      const province = provinces[provinceIndex];

      await connection.query(
        `INSERT INTO users(
            name,
            surname,
            email,
            password,
            telephone,
            gender,
            birthday,
            age,
            province,
            creating_date,
            update_date,
            last_auth_update,
            active
            )
            VALUES(
            "${name}",
            "${surname}",
             "${emailAddress}",
             SHA2("loremipsum", 512),
             "${telephone}",
             "${gender}",
             "${birthdayDB}",
             "${age}",
             "${province}",
             UTC_TIMESTAMP,
             UTC_TIMESTAMP,
             UTC_TIMESTAMP,
             1
             )
            `
      );
    }
    console.log("Creando tabla business");

    //insertar pricing_list en futuro para QR Carta en PDF
    //creamos tabla de negocios
    await connection.query(`
      CREATE TABLE business(
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        manager VARCHAR (100) NOT NULL,
        category ENUM('BAR', 'PELUQUERÍA', 'TERRAZA', 'RESTAURANTE', 'RESERVADO') NOT NULL,
        email VARCHAR(50) NOT NULL,
        password VARCHAR(500) NOT NULL,
        telephone VARCHAR(20)  NOT NULL,
        opening_time VARCHAR(200),
        closing_time VARCHAR(200),
        length_booking INT NOT NULL DEFAULT '30',
        description VARCHAR (100),
        bank_account VARCHAR(150),
        allotment_available INT DEFAULT '0',
        allotment INT DEFAULT '0',
        profile_picture VARCHAR(150),
        city VARCHAR(50),
        zip_code VARCHAR(50),
        province VARCHAR(50) NOT NULL,
        line1 VARCHAR(100),
        line2 VARCHAR(100),
        registration_code TINYTEXT,
        resign_reason VARCHAR(100),
        creating_date DATETIME NOT NULL,
        update_date DATETIME NOT NULL,
        last_auth_update DATETIME NOT NULL,
        status ENUM('ACTIVO', 'SIN_VALIDAR', 'PENDIENTE', 'CERRADO', 'CERRADO_BY_ADMIN') DEFAULT 'SIN_VALIDAR'
        );
        `);

    console.log("Poblando tabla business");

    // poblamos tabla de negocios
    const business = 1000;
    const categories = ["BAR", "PELUQUERÍA", "TERRAZA", "RESTAURANTE"];
    for (let index = 0; index < business; index++) {
      const name = faker.company.companyName();
      const categoryIndex = Math.floor(Math.random() * categories.length);
      const category = categories[categoryIndex];
      const manager = faker.name.findName();
      const emailAddress = faker.internet.email();
      const openingTime = random(7, 16);
      const closingTime = openingTime + 8;
      const description = faker.company.catchPhraseDescriptor();
      const banckAccount = faker.finance.iban();
      const provinceIndex = Math.floor(Math.random() * provinces.length);
      const province = provinces[provinceIndex];
      const zipCode = faker.address.zipCode();
      const line1 = faker.address.streetAddress();
      const line2 = faker.address.secondaryAddress();
      await connection.query(
        `INSERT INTO business(
          name,
          category,
          manager,
          email,
          password,
          telephone,
          opening_time,
          closing_time,
          description,
          bank_account,
          allotment_available,
          allotment,
          city,
          zip_code,
          province,
          line1,
          line2,
          creating_date,
          update_date,
          last_auth_update,
          status
          )
          VALUES(
            "${name}",
            "${category}",
            "${manager}",
            "${emailAddress}",
            SHA2("loremipsum", 512),
            "${telephone}",
            "${openingTime}",
            "${closingTime}",
            "${description}",
            "${banckAccount}",
            5,
            5,
            "${province}",
            "${zipCode}",
            "${province}",
            "${line1}",
            "${line2}",
            UTC_TIMESTAMP,
            UTC_TIMESTAMP,
            UTC_TIMESTAMP,
            'ACTIVO'
            )`
      );
    }

    console.log("Creando tabla Dias de apertura");

    //creamos tabla de dias de apertura de los negocios
    await connection.query(`
    CREATE TABLE opening_days(
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      id_business INT UNSIGNED,
      FOREIGN KEY (id_business) REFERENCES business (id),
      day INT
      );
      `);

    console.log("Poblando tabla Dias de apertura");

    //poblamos tabla de dias de apertura de los negocios
    /* for (let index = 1; index <= business; index++) {
       let openingDays = 7;
       let openingWeek = random(0, 2);
       for (let i = 1; i <= openingDays; i++) {
         let day = openingWeek + i;
         await connection.query(`
           INSERT INTO opening_days(id_business, day)
           VALUES("${index}", "${day}")`);
       }
     }*/

    //poblamos tabla de dias de apertura de los negocios
    for (let index = 1; index <= business; index++) {
      let openingDays = 7;
      const dayOff = random(1, 7);
      let dayOff2 = dayOff + 1;
      if (dayOff2 === 8) {
        dayOff2 = 1
      }
      for (let i = 1; i <= openingDays; i++) {
        let day = i;
        if (dayOff === day || dayOff2 === day) {
          day = 0
        }
        await connection.query(`
          INSERT INTO opening_days(id_business, day)
          VALUES("${index}", "${day}")`);
      }
    }

    console.log("Creando tabla de fotos");

    //creamos tabla de fotos de los negocios
    await connection.query(`
    CREATE TABLE pictures(
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      update_date DATETIME NOT NULL,
      id_business INT UNSIGNED,
      FOREIGN KEY (id_business) REFERENCES business (id) ON DELETE CASCADE,
      picture VARCHAR(50)
      );
      `);

    console.log("Creando tabla de reservas");

    //creamos tabla de bookings
    await connection.query(`
      CREATE TABLE booking(
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        check_in_time DATETIME NOT NULL,
        check_in_day DATE,
        check_out_time DATETIME NOT NULL,
        check_out_day DATE,
        frequenzy_time TIME,
        status ENUM('CONFIRMADO', 'CANCELADO', 'CHECK_IN', 'CHECK_OUT', 'NO_SHOW', 'PENDIENTE_DE_PAGO', 'MODIFICADO') DEFAULT 'CONFIRMADO',
        units INT default '1',
        request VARCHAR(100),
        rating INT,
        rating_description VARCHAR(200),
        rating_answer VARCHAR(200),
        creating_date TIMESTAMP NOT NULL,
        update_date DATETIME NOT NULL,
        credit_card_number VARCHAR(150) NOT NULL,
        holder_name VARCHAR(150) NOT NULL,
        expiry_month VARCHAR(150) NOT NULL,
        expiry_year VARCHAR(150) NOT NULL,
        cvc_code VARCHAR(150) NOT NULL,
        fee INT DEFAULT '3',
        payment_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        id_business INT UNSIGNED,
        FOREIGN KEY (id_business) REFERENCES business (id) ON DELETE CASCADE,
        id_user INT UNSIGNED,
        FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE
        );
    
        `);

    console.log("Poblando tabla de reservas pasadas");


    // poblamos tabla de bookings
    const booking = 4000;
    for (let index = 0; index < booking; index++) {
      const checkInTime = faker.date.past();
      checkInTime.setMinutes(0, 0, 0);
      checkInTime.setFullYear(2020);
      checkInTime.setMonth(random(1, 8))
      const checkInTimeDB = formatDateTimeToDB(checkInTime);
      const checkInDayDB = formatDateToDB(checkInTime);
      const checkOutTime = addMinutes(checkInTime, 30);
      const checkOutTimeDB = formatDateTimeToDB(checkOutTime);
      const checkOutDayDB = formatDateToDB(checkOutTime);
      const frequenzy = minutesToDB(30);
      const rating = random(1, 5);
      const ratingDescription = faker.company.catchPhraseDescriptor();
      const creditCardNumber = random(4000000000000000, 5999999999999999);
      const holderName = faker.name.findName();
      const expiryMonth = random(1, 12);
      const expiryYear = random(2020, 2040);
      const cvcCode = random(100, 9999);
      const paymentDate = formatDateToDB(faker.date.past());
      const idBusiness = random(1, business);
      const idUser = random(1, users);
      await connection.query(
        `INSERT INTO booking (check_in_time,
          check_in_day,
              check_out_time,
              check_out_day,
              frequenzy_time,
              rating,
              rating_description,
              credit_card_number,
              holder_name,
              expiry_month,
              expiry_year,
              cvc_code,
              payment_date,
              creating_date,
              update_date,
              id_business,
              id_user,
              status
              )
              VALUES("${checkInTimeDB}",
              "${checkInDayDB}",
              "${checkOutTimeDB}",
              "${checkOutDayDB}",
              "${frequenzy}",
              "${rating}",
              "${ratingDescription}",
              SHA2("${creditCardNumber}", 512),
              SHA2("${holderName}", 512),
              SHA2("${expiryMonth}", 512),
              SHA2("${expiryYear}", 512),
              SHA2("${cvcCode}", 512),
              "${paymentDate}",
              UTC_TIMESTAMP,
              UTC_TIMESTAMP,
              "${idBusiness}",
              "${idUser}",
              "CHECK_OUT"
              )`
      );
    }

    console.log("Poblando tabla de reservas confirmadas");

    for (let index = 0; index < booking / 2; index++) {
      const checkInTime = faker.date.future();
      checkInTime.setMinutes(0, 0, 0);
      checkInTime.setFullYear(2020);
      checkInTime.setMonth(random(9, 12))
      const checkInTimeDB = formatDateTimeToDB(checkInTime);
      const checkInDayDB = formatDateToDB(checkInTime);
      const checkOutTime = addMinutes(checkInTime, 30);
      const checkOutTimeDB = formatDateTimeToDB(checkOutTime);
      const checkOutDayDB = formatDateToDB(checkOutTime);
      const frequenzy = minutesToDB(30);
      const creditCardNumber = random(4000000000000000, 5999999999999999);
      const holderName = faker.name.findName();
      const expiryMonth = random(1, 12);
      const expiryYear = random(2020, 2040);
      const cvcCode = random(100, 9999);
      const idBusiness = random(1, business);
      const idUser = random(1, users);
      await connection.query(
        `INSERT INTO booking (check_in_time,
          check_in_day,
              check_out_time,
              check_out_day,
              frequenzy_time,
              credit_card_number,
              holder_name,
              expiry_month,
              expiry_year,
              cvc_code,
              payment_date,
              creating_date,
              update_date,
              id_business,
              id_user,
              status
              )
              VALUES("${checkInTimeDB}",
              "${checkInDayDB}",
              "${checkOutTimeDB}",
              "${checkOutDayDB}",
              "${frequenzy}",
              SHA2("${creditCardNumber}", 512),
              SHA2("${holderName}", 512),
              SHA2("${expiryMonth}", 512),
              SHA2("${expiryYear}", 512),
              SHA2("${cvcCode}", 512),
              UTC_TIMESTAMP,
              UTC_TIMESTAMP,
              UTC_TIMESTAMP,
              "${idBusiness}",
              "${idUser}",
              "CONFIRMADO"
              )`
      );
    }

    console.log("Creando vista ");


    //creamos la view en sql para filtrar facilmente los datos
    await connection.query(`
       CREATE VIEW business_details AS
  SELECT bu.id, bu.profile_picture, allotment, allotment_available, name, bu.category, bu.province, opening_time, closing_time, check_in_time, check_out_time, bu.status,
	COUNT(b.id) AS count, (SELECT AVG(rating) FROM booking WHERE id_business = bu.id) AS vote_average,
	(SELECT COUNT(rating) FROM booking WHERE id_business = bu.id) AS total_votes
  FROM business bu LEFT OUTER JOIN booking b ON b.id_business = bu.id
 WHERE NOT b.status = 'CANCELADO' OR bu.id NOT IN (SELECT id_business from booking)
  GROUP BY bu.id, bu.profile_picture, allotment, allotment_available, name, bu.category, bu.province, opening_time, closing_time, check_in_time, check_out_time, bu.status, vote_average, total_votes;

`);
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Todo hecho, liberando conexión");
    if (connection) connection.release();
    process.exit();
  }
}
main();
