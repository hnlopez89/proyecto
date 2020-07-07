require("dotenv").config();

const faker = require("faker/locale/es");
const { getConnection } = require("./db");
const { formatDateToDB } = require("./helpers");
const { random } = require("lodash");

let connection;

async function main() {
  try {
    // Conseguir conexión a la base de datos
    connection = await getConnection();

    // Borrar las tablas si existen (diary, diary_votes)
    console.log("Borrando tablas");
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
      picture VARCHAR(80),
      creating_date TIMESTAMP NOT NULL,
      update_date DATETIME NOT NULL,
      active BOOLEAN DEFAULT false,
      registration_code TINYTEXT,
      last_auth_update DATETIME NOT NULL
      );
    `);

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
    //poblamos tabla de customer

    const users = 20;
    for (let index = 0; index < users; index++) {
      const name = faker.name.firstName();
      const surname = faker.name.lastName();
      const emailAddress = faker.internet.email();
      await connection.query(
        `INSERT INTO users(
            name,
            surname,
            email,
            password,
            creating_date,
            update_date,
            last_auth_update
            )
            VALUES(
            "${name}",
            "${surname}",
             "${emailAddress}",
             SHA2("${faker.internet.password()}", 512),
             UTC_TIMESTAMP,
             UTC_TIMESTAMP,
             UTC_TIMESTAMP
             )
            `
      );
    }

    await connection.query(`
      CREATE TABLE business(
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        manager VARCHAR (100) NOT NULL,
        category ENUM('BAR', 'PELUQUERÍA', 'TERRAZA', 'RESTAURANTE', 'RESERVADO') DEFAULT 'BAR' NOT NULL,
        email VARCHAR(50) NOT NULL,
        password VARCHAR(500) NOT NULL,
        opening_time VARCHAR(200),
        closing_time VARCHAR(200),
        score DECIMAL(3, 1),
        number_reviews INT DEFAULT '0',
        bank_account VARCHAR(50),
        allotment INT DEFAULT '0',
        allotment_available INT DEFAULT '0',
        city VARCHAR(50) NOT NULL,
        zip_code VARCHAR(50),
        province VARCHAR(50),
        line1 VARCHAR(100),
        line2 VARCHAR(100),
        registration_code TINYTEXT,
        creating_date DATETIME NOT NULL,
        update_date DATETIME NOT NULL,
        last_auth_update DATETIME NOT NULL,
        status ENUM('OPERATIVO', 'PENDIENTE', 'CERRADO') DEFAULT 'PENDIENTE'
        );
        `);

    const business = 20;
    const categories = ["BAR", "PELUQUERÍA", "TERRAZA", "RESTAURANTE"];
    for (let index = 0; index < business; index++) {
      const name = faker.company.companyName();
      const categoryIndex = Math.floor(Math.random() * categories.length);
      const manager = faker.name.findName();
      const category = categories[categoryIndex];
      const emailAddress = faker.internet.email();
      const score = random(1, 5);
      const banckAccount = faker.finance.iban();
      const city = faker.address.city();
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
          score,
          bank_account,
          city,
          zip_code,
          province,
          line1,
          line2,
          creating_date,
          update_date,
          last_auth_update
          )
          VALUES(
            "${name}",
            "${category}",
            "${manager}",
            "${emailAddress}",
            SHA2("${faker.internet.password()}", 512),
            "${score}",
            "${banckAccount}",
            "${city}",
            "${zipCode}",
            "${province}",
            "${line1}",
            "${line2}",
            UTC_TIMESTAMP,
            UTC_TIMESTAMP,
            UTC_TIMESTAMP
            )`
      );
    }
    //creamos tabla de dias de apertura de los negocios
    await connection.query(`
      CREATE TABLE opening_days(
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      day INT,
      id_business INT UNSIGNED,
      FOREIGN KEY (id_business) REFERENCES business (id)
      );
    `);
    //poblamos tabla de dias de apertura de los negocios

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
    //poblamos tabla de fotos de los negocios

    //creamos tabla de bookings
    await connection.query(`
    CREATE TABLE booking(
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        check_in_time DATETIME NOT NULL,
        check_out_time DATETIME NOT NULL,
        frequenzy_time TIME,
        status ENUM('CONFIRMADO', 'CANCELADO', 'PASADO', 'PENDIENTE', 'MODIFICADO') DEFAULT 'CONFIRMADO',
        units INT default '1',
        rating INT,
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

    const booking = 10;
    for (let index = 0; index < booking; index++) {
      const checkInTime = formatDateToDB(faker.date.recent());
      const checkOutTime = checkInTime;
      const frequenzyTime = checkOutTime;
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
          check_out_time,
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
          VALUES("${checkInTime}",
          "${checkOutTime}",
          "${frequenzyTime}",
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
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Todo hecho, liberando conexión");
    if (connection) connection.release();
    process.exit();
  }
}
main();
