require("dotenv").config();

const express = require("express");
//const morgan = require("morgan");
const bodyParser = require("body-parser");
//const fileUpload = require("express-fileupload");

// CONTROLADORES
// USUARIOS
const newCustomer = require("./controllers/customer/newCustomer");
const validateCustomer = require("./controllers/customer/validateCustomer");
const loginCustomer = require("./controllers/customer/loginCustomer");
const isCustomer = require("./middleware/isCustomer");
const getCustomer = require("./controllers/customer/getCustomer");
const editCustomer = require("./controllers/customer/editCustomer");

// NEGOCIOS
const newBusiness = require("./controllers/business/newBusiness");
const validateBusiness = require("./controllers/business/validateBusiness");
const loginBusiness = require("./controllers/business/loginBusiness");
const getBusiness = require("./controllers/business/getBusiness");
const isBusiness = require("./middleware/isBusiness");

// RESERVAS
const newBooking = require("./controllers/bookings/newBooking");
const bookingExists = require("./middleware/bookingExists");
const listBookings = require("./controllers/bookings/listBookings");
const getBooking = require("./controllers/bookings/getBooking");
const editBooking = require("./controllers/bookings/editBooking");
const voteBooking = require("./controllers/bookings/voteBooking");

//const listBusiness = require("./controllers/business/listBusiness");
const listing = require("./controllers/business/listing");

const app = express();

// Procesado de body tipo json
app.use(bodyParser.json());

//BUSINESS ENDPOINTS

//CREACIÓN DE BUSINESS
//POST -/BUSINESS
app.post("/business", newBusiness);

//VALIDACION DE BUSINESS
//GET -/BUSINESS/VALIDATION/REGISTRATIONCODE
app.get("/business/validation/:registrationCode", validateBusiness);

//LOGIN DE BUSINESS
//POST -/BUSINESS/
app.post("/business/login", loginBusiness);

//VER INFORMACIÓN DE NEGOCIO
//SOLO PARA NEGOCIOS REGISTRADOS
//SI EL USUARIO ES EL MISMO, DEBERÍA MOSTRAR TODA LA INFO
app.get("/business/:id", isBusiness, getBusiness);

//LISTADO DE BUSINESS
//GET -/BUSINESS
//app.get("/business", listBusiness);

//LISTADO MEJORADO ULTRA MEGA TOP
//GET -/BUSINESS
app.get("/business", listing);

//USER ENDPOINTS

//REGISTRO DE USUARIOS
//POST -/customers
app.post("/customer", newCustomer);

//VALIDACIÓN DE USUARIOS
//GET -/customer/validation/registrationCode
app.get("/customer/validation/:registrationCode", validateCustomer);

//LOGIN DE USUARIOS
// POST -/CUSTOMER/LOGIN
app.post("/customer/login", loginCustomer);

//VER INFORMACIÓN DE USUARIO
// GET - //CUSTOMER:ID
//SOLO PARA USUARIOS REGISTRADOS
//SI EL USUARIO ES EL MISMO DEBERÍA MOSTRAR TODA LA INFORMACIÓN
app.get("/customer/:id", isCustomer, getCustomer);

//EDITAR DATOS DE USUARIO: email, name, avatar
//put - /customer/:id
//sólo el usuario
app.put("/customer/:id", isCustomer, editCustomer);

//BOOKING ENDPOINTS

//CREAR UNA RESERVA
//POST - /customer/:id/booking
//sólo el usuario
app.post(
  "/customer/:idCustomer/business/:idBusiness/booking/",
  isCustomer,
  newBooking
);

//LISTAR BOOKINGS DE USUARIO
//GET - /bookings/:id
//sólo el usuario
app.get("/customer/:id/booking/", isCustomer, listBookings);

//MOSTRAR UNA RESERVA DETERMINADA DE UN USUARIO
//GET - /bookings/:
//sólo el usuario
app.get(
  "/customer/:idCustomer/booking/:idBooking/",
  isCustomer,
  bookingExists,
  getBooking
);

//EDITAR UNA RESERVA DETERMINADA DE UN USUARIO
//PUT -/bookings/:
//sólo el usuario que reservó
app.put(
  "/customer/:idCustomer/booking/:idBooking",
  isCustomer,
  bookingExists,
  editBooking
);

//VALORAR UNA RESERVA
//PUT -/bookings/:id
app.put(
  "/customer/:idCustomer/booking/:idBooking/value",
  isCustomer,
  bookingExists,
  voteBooking
);

// Error middleware
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

// Not found
app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not found",
  });
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`API funcionando en http://localhost:${port} 🙈`);
});
