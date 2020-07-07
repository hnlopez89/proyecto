require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

// CONTROLADORES
// USUARIOS
const newUser = require("./controllers/user/newUser");
const validateUser = require("./controllers/user/validateUser");
const loginUser = require("./controllers/user/loginUser");
const isUser = require("./middleware/isUser");
const getUser = require("./controllers/user/getUser");
const editUser = require("./controllers/user/editUser");
const recoverUserPassword = require("./controllers/user/recoverUserPassword");

// NEGOCIOS
const newBusiness = require("./controllers/business/newBusiness");
const validateBusiness = require("./controllers/business/validateBusiness");
const loginBusiness = require("./controllers/business/loginBusiness");
const getBusiness = require("./controllers/business/getBusiness");
const isBusiness = require("./middleware/isBusiness");
const editBusiness = require("./controllers/business/editBusiness");

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

app.use(morgan("dev"));

// Procesado de body tipo json
app.use(bodyParser.json());

//procesado de body tipo form-data
app.use(fileUpload());

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

//EDITAR INFORMACIÓN DE NEGOCIO
//SOLO PARA NEGOCIOS REGISTRADOS
//SI EL USUARIO ES EL MISMO, DEBERÍA PODER EDITAR SU INFO
app.put("/business/:id", isBusiness, editBusiness);

//LISTADO DE BUSINESS
//GET -/BUSINESS
//app.get("/business", listBusiness);

//LISTADO MEJORADO ULTRA MEGA TOP
//GET -/BUSINESS
app.get("/business", listing);

//USER ENDPOINTS

//REGISTRO DE USUARIOS
//POST -/users
app.post("/user", newUser);

//VALIDACIÓN DE USUARIOS
//GET -/user/validation/registrationCode
app.get("/user/validation/:registrationCode", validateUser);

//LOGIN DE USUARIOS
// POST -/USER/LOGIN
app.post("/user/login", loginUser);

//VER INFORMACIÓN DE USUARIO
// GET - //USER:ID
//SOLO PARA USUARIOS REGISTRADOS
//SI EL USUARIO ES EL MISMO DEBERÍA MOSTRAR TODA LA INFORMACIÓN
app.get("/user/:id", isUser, getUser);

//EDITAR DATOS DE USUARIO: email, name, avatar
//put - /user/:id
//sólo el usuario
app.put("/user/:id", isUser, editUser);

//RECUPERAR CONTRASEÑA
//POST - /user/:id
//sólo el usuario
app.post("/user/recover-password", recoverUserPassword);

//BOOKING ENDPOINTS

//CREAR UNA RESERVA
//POST - /user/:id/booking
//sólo el usuario
app.post("/user/:idUser/business/:idBusiness/booking/", isUser, newBooking);

//LISTAR BOOKINGS DE USUARIO
//GET - /bookings/:id
//sólo el usuario
app.get("/user/:id/booking/", isUser, listBookings);

//MOSTRAR UNA RESERVA DETERMINADA DE UN USUARIO
//GET - /bookings/:
//sólo el usuario
app.get("/user/:idUser/booking/:idBooking/", isUser, bookingExists, getBooking);

//EDITAR UNA RESERVA DETERMINADA DE UN USUARIO
//PUT -/bookings/:
//sólo el usuario que reservó
app.put("/user/:idUser/booking/:idBooking", isUser, bookingExists, editBooking);

//VALORAR UNA RESERVA
//PUT -/bookings/:id
app.put(
  "/user/:idUser/booking/:idBooking/value",
  isUser,
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
