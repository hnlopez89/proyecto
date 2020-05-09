USE proyecto_tempo;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE customer (
PK_id_customer INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(50) NOT NULL,
surname VARCHAR(50) NOT NULL, 
email_address VARCHAR(50) UNIQUE NOT NULL,
username VARCHAR(50) UNIQUE NOT NULL,
password VARCHAR(100) NOT NULL,
picture VARCHAR(20),
creating_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
update_date DATETIME NOT NULL
);

CREATE TABLE business (
PK_id_business INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(20) NOT NULL,
category ENUM('BAR', 'PELUQUERÍA', 'TERRAZA', 'RESTAURANTE', 'RESERVADO') NOT NULL,
username VARCHAR(50) UNIQUE NOT NULL,
email_address VARCHAR(50) NOT NULL,
password VARCHAR(100) NOT NULL,
pictures VARCHAR(50),
opening_time VARCHAR(200),
score DECIMAL (3,1),
number_reviews INT DEFAULT '0',
bank_account VARCHAR(50),
creating_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
update_date DATETIME,
status ENUM('OPERATIVO', 'PENDIENTE', 'CERRADO'),
calendar DATETIME,
allotment INT DEFAULT '0',
allotment_available INT DEFAULT '0',
city VARCHAR(50),
zip_code VARCHAR(50),
province VARCHAR(50),
line1  VARCHAR(100),
line2 VARCHAR(100)
);

CREATE TABLE pictures(
PK_id_pictures INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
FK_pictures_business INT UNSIGNED,
FOREIGN KEY (FK_pictures_business) REFERENCES business (PK_id_business),
picture VARCHAR(20)
);

CREATE TABLE booking (
PK_id_booking INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
check_in_time DATETIME NOT NULL,
check_out_time DATETIME NOT NULL,
frequenzy_time TIME,
status ENUM('CONFIRMADO', 'CANCELADO', 'PASADO'),
units INT default '0',
rating INT,
creating_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
update_date DATETIME,
holder_name VARCHAR(30) NOT NULL,
expiry_date DATE NOT NULL,
cvc_code INT NOT NULL,
fee INT DEFAULT '3',
payment_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
FK_booking_business INT UNSIGNED,
FOREIGN KEY (FK_booking_business) REFERENCES business (PK_id_business),
FK_booking_customer INT UNSIGNED,
FOREIGN KEY (FK_booking_customer) REFERENCES customer (PK_id_customer)
);

SET FOREIGN_KEY_CHECKS = 1;