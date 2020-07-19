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
      gender ENUM ('VARON', 'MUJER'),
      birthday DATE,
      age INT,
      city VARCHAR(50),
      picture VARCHAR(80),
      creating_date TIMESTAMP NOT NULL,
      update_date DATETIME NOT NULL,
      active BOOLEAN DEFAULT false,
      registration_code TINYTEXT,
      last_auth_update DATETIME NOT NULL
      );
    `);

    //poblamos tabla de usuarios
    await connection.query(
      `INSERT INTO users(
        role,
        name,
        surname,
        email,
        password,
        creating_date,
        update_date,
        last_auth_update
        )
        VALUES (
          'admin',
        "Hugo",
        "Nogueira",
        "esehugo@hotmail.com",
        SHA2("${faker.internet.password()}", 512),
        UTC_TIMESTAMP,
        UTC_TIMESTAMP,
        UTC_TIMESTAMP
        )
      `
    );
    const users = 20;
    const genders = ["VARON", "MUJER"];
    const cities = ["Madrid", "Barcelona", "A Coruña", "Santiago"];
    for (let index = 0; index < users; index++) {
      const name = faker.name.firstName();
      const surname = faker.name.lastName();
      const genderIndex = Math.floor(Math.random() * genders.length);
      const gender = genders[genderIndex];
      const birthday = faker.date.past();
      const birthdayDB = formatDateToDB(birthday)
      const age = random(18, 75);
      const emailAddress = faker.internet.email();
      const cityIndex = Math.floor(Math.random() * cities.length);
      const city = cities[cityIndex];

      await connection.query(
        `INSERT INTO users(
            name,
            surname,
            email,
            password,
            gender,
            birthday,
            age,
            city,
            creating_date,
            update_date,
            last_auth_update
            )
            VALUES(
            "${name}",
            "${surname}",
             "${emailAddress}",
             SHA2("${faker.internet.password()}", 512),
             "${gender}",
             "${birthdayDB}",
             "${age}",
             "${city}",
             UTC_TIMESTAMP,
             UTC_TIMESTAMP,
             UTC_TIMESTAMP
             )
            `
      );
    }
    //creamos tabla de negocios
    await connection.query(`
      CREATE TABLE business(
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        manager VARCHAR (100) NOT NULL,
        category ENUM('BAR', 'PELUQUERÍA', 'TERRAZA', 'RESTAURANTE', 'RESERVADO') NOT NULL,
        email VARCHAR(50) NOT NULL,
        password VARCHAR(500) NOT NULL,
        opening_time VARCHAR(200),
        closing_time VARCHAR(200),
        length_booking INT NOT NULL DEFAULT '30',
        description VARCHAR (100),
        pricing_list VARCHAR (50),
        bank_account VARCHAR(150),
        allotment_available INT DEFAULT '0',
        allotment INT DEFAULT '0',
        profile_picture VARCHAR(150),
        city VARCHAR(50) NOT NULL,
        zip_code VARCHAR(50),
        province VARCHAR(50),
        line1 VARCHAR(100),
        line2 VARCHAR(100),
        registration_code TINYTEXT,
        creating_date DATETIME NOT NULL,
        update_date DATETIME NOT NULL,
        last_auth_update DATETIME NOT NULL,
        status ENUM('ACTIVO', 'SIN_VALIDAR', 'PENDIENTE', 'CERRADO', 'CERRADO_BY_ADMIN') DEFAULT 'SIN_VALIDAR'
        );
        `);
    // poblamos tabla de negocios
    const business = 50;
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
      const cityIndex = Math.floor(Math.random() * cities.length);
      const city = cities[cityIndex];
      const zipCode = faker.address.zipCode();
      const province = faker.address.state();
      const line1 = faker.address.streetAddress();
      const line2 = faker.address.secondaryAddress();
      await connection.query(
        `INSERT INTO business(
          name,
          category,
          manager,
          email,
          password,
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
            SHA2("${faker.internet.password()}", 512),
            "${openingTime}",
            "${closingTime}",
            "${description}",
            "${banckAccount}",
            5,
            5,
            "${city}",
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

    //creamos tabla de dias de apertura de los negocios
    await connection.query(`
    CREATE TABLE opening_days(
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      id_business INT UNSIGNED,
      FOREIGN KEY (id_business) REFERENCES business (id),
      day INT
      );
      `);

    //poblamos tabla de dias de apertura de los negocios
    for (let index = 1; index <= business; index++) {
      let openingDays = 5;
      let openingWeek = random(0, 2);
      for (let i = 1; i <= openingDays; i++) {
        let day = openingWeek + i;
        await connection.query(`
          INSERT INTO opening_days(id_business, day)
          VALUES("${index}", "${day}")`);
      }
    }

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
        creating_date TIMESTAMP NOT NULL,
        update_date DATETIME NOT NULL,
        credit_card_number VARCHAR(150) NOT NULL,
        holder_name VARCHAR(150) NOT NULL,
        expiry_date VARCHAR(150) NOT NULL,
        cvc_code VARCHAR(150) NOT NULL,
        fee INT DEFAULT '3',
        payment_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        id_business INT UNSIGNED,
        FOREIGN KEY (id_business) REFERENCES business (id) ON DELETE CASCADE,
        id_user INT UNSIGNED,
        FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE
        );
    
        `);

    // poblamos tabla de bookings

    const booking = 300;
    for (let index = 0; index < booking; index++) {
      const checkInTime = faker.date.future()
      const checkInTimeDB = formatDateTimeToDB(checkInTime);
      const checkInDayDB = formatDateToDB(checkInTime);
      const checkOutTime = addMinutes(checkInTime, 30);
      const checkOutTimeDB = formatDateTimeToDB(checkOutTime);
      const checkOutDayDB = formatDateToDB(checkOutTime);
      const frequenzy = minutesToDB(30);
      const rating = random(1, 5);
      const creditCardNumber = random(4000000000000000, 5999999999999999);
      const holderName = faker.name.findName();
      const expiryDate = formatDateToDB(faker.date.future());
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
              credit_card_number,
              holder_name,
              expiry_date,
              cvc_code,
              payment_date,
              creating_date,
              update_date,
              id_business,
              id_user
              )
              VALUES("${checkInTimeDB}",
              "${checkInDayDB}",
              "${checkOutTimeDB}",
              "${checkOutDayDB}",
              "${frequenzy}",
              "${rating}",
              SHA2("${creditCardNumber}", 512),
              SHA2("${holderName}", 512),
              SHA2("${expiryDate}", 512),
              SHA2("${cvcCode}", 512),
              "${paymentDate}",
              UTC_TIMESTAMP,
              UTC_TIMESTAMP,
              "${idBusiness}",
              "${idUser}"
              )`
      );
    }

    //creamos la view en sql para filtrar facilmente los datos
    await connection.query(`
     CREATE VIEW business_details AS
  SELECT bu.id, bu.profile_picture, allotment, allotment_available, name, bu.category, bu.city, opening_time, closing_time, check_in_time, check_out_time, bu.status,
	COUNT(b.id) AS count, (SELECT AVG(rating) FROM booking WHERE id_business = bu.id) AS vote_average,
	(SELECT COUNT(rating) FROM booking WHERE id_business = bu.id) AS total_votes
  FROM business bu LEFT OUTER JOIN booking b ON b.id_business = bu.id
  GROUP BY bu.id, bu.profile_picture, allotment, allotment_available, name, bu.category, bu.city, opening_time, closing_time, check_in_time, check_out_time, bu.status, vote_average, total_votes;

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
