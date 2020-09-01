require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors")

// CONTROLADORES

// USUARIOS
const newUser = require("./controllers/user/newUser");
const validateUser = require("./controllers/user/validateUser");
const loginUser = require("./controllers/user/loginUser");
const isUser = require("./middleware/isUser");
const getUser = require("./controllers/user/getUser");
const editUser = require("./controllers/user/editUser");
const recoverUserPassword = require("./controllers/user/recoverUserPassword");
const resetUserPassword = require("./controllers/user/resetUserPassword");
const editUserPassword = require("./controllers/user/editUserPassword");
const deactiveUser = require("./controllers/user/deactiveUser");

// NEGOCIOS
const newBusiness = require("./controllers/business/newBusiness");
const validateBusiness = require("./controllers/business/validateBusiness");
const loginBusiness = require("./controllers/business/loginBusiness");
const isBusiness = require("./middleware/isBusiness");
const getBusiness = require("./controllers/business/getBusiness");
const viewOwnBusinessRating = require("./controllers/business/viewOwnBusinessRating");
const editBusiness = require("./controllers/business/editBusiness");
const editBusinessPictures = require("./controllers/business/editBusinessPictures");
const recoverBusinessPassword = require("./controllers/business/recoverBusinessPassword");
const resetBusinessPassword = require("./controllers/business/resetBusinessPassword");
const editBusinessPassword = require("./controllers/business/editBusinessPassword");
const deactiveBusiness = require("./controllers/business/deactiveBusiness");

//SEARCH BUSINESS
//const listBusiness = require("./controllers/business/listBusiness");
const searchBusinessAvailable = require("./controllers/search/searchBusinessAvailable");
const viewBusiness = require("./controllers/search/viewBusiness");
const viewTopBusiness = require("./controllers/search/viewTopBusiness")
const viewBusinessRating = require("./controllers/search/viewBusinessRating");

// RESERVAS
const bookingExists = require("./middleware/bookingExists");
// ACTION BY USER
const newBooking = require("./controllers/bookings/newBooking");
const listUserBookingsConfirmed = require("./controllers/bookings/listUserBookingsConfirmed");
const listUserBookingsAdvanced = require("./controllers/bookings/listUserBookingsAdvanced");
const listUserBookingsPast = require("./controllers/bookings/listUserBookingsPast");
const getUserBooking = require("./controllers/bookings/getUserBooking");
const editUserBooking = require("./controllers/bookings/editUserBooking");
const voteBooking = require("./controllers/bookings/voteBooking");
const cancelUserBooking = require("./controllers/bookings/cancelUserBooking");
const editUserBookingTC = require("./controllers/bookings/editUserBookingTC");
// ACTION BY BUSINESS
const listBusinessBookings = require("./controllers/bookings/listBusinessBookings");
const listBusinessBookingsAdvanced = require("./controllers/bookings/listBusinessBookingsAdvanced");
const listBusinessTodayBookings = require("./controllers/bookings/listBusinessTodayBookings");
const listBusinessTomorrowBookings = require("./controllers/bookings/listBusinessTomorrowBookings");
const getBusinessBooking = require("./controllers/bookings/getBusinessBooking");
const checkInBooking = require("./controllers/bookings/checkInBooking");
const checkOutBooking = require("./controllers/bookings/checkOutBooking");
const noShowBooking = require("./controllers/bookings/noShowBooking");
const checkBusinessAvailability = require("./controllers/bookings/checkBusinessAvailability");
// ADMIN
const isAdmin = require("./middleware/isAdmin");
const activateBusiness = require("./controllers/admin/activateBusiness");
const checkBusiness = require("./controllers/admin/adminCheckBusiness");
const listBusinessPending = require("./controllers/admin/listAdminBusinessPending");
const listBookings = require("./controllers/admin/listAllBookings");
const listBusiness = require("./controllers/admin/listAllBusiness");
const listUsers = require("./controllers/admin/listAllUsers");
const activateAdmin = require("./controllers/admin/activateAdmin")
const listBookingsPending = require("./controllers/admin/listBookingsPending");
const listBusinessBadRating = require("./controllers/admin/listBusinessBadRating");
const editAdminBooking = require("./controllers/admin/editAdminBooking");


const app = express();

app.use(cors())

app.use(morgan("dev"));

// Procesado de body tipo json
app.use(bodyParser.json());

//procesado de body tipo form-data
app.use(fileUpload());

app.use(express.static('static'));

/* ********************************************* */
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
app.get("/user/:id", isUser, getUser);

//EDITAR DATOS DE USUARIO: email, name, avatar
//put - /user/:id
//sólo el usuario
app.put("/user/:id", isUser, editUser);

//EDITAR PASSWORD DE USUARIO
//put - /user/:id/password
//sólo el usuario
app.put("/user/:id/password", isUser, editUserPassword);

//RECUPERAR CONTRASEÑA DE USUARIO
//POST - /user/:id
//sólo el usuario
app.post("/user/recover-password", recoverUserPassword);

//RESETEAR CONTRASEÑA DE USUARIO
// POST - /users/reset-password
// Público
app.post("/user/reset-password", resetUserPassword);

//DESACTIVAR CUENTA DE USUARIO
//PUT - /users/id/deactive
//PRIVADO
app.put("/user/:id/deactive", isUser, deactiveUser);

/* ********************************************* */

//BUSINESS ENDPOINTS

//CREACIÓN DE BUSINESS
//POST -/BUSINESS
app.post("/business", newBusiness);

//VALIDACIÓN DE USUARIOS
//GET -/user/validation/registrationCode
app.get("/business/validation/:registrationCode", validateBusiness);

//LOGIN DE BUSINESS
//POST -/BUSINESS/
app.post("/business/login", loginBusiness);

//VER INFORMACIÓN DE NEGOCIO
//SOLO PARA NEGOCIOS REGISTRADOS
//SI EL USUARIO ES EL MISMO, DEBERÍA MOSTRAR TODA LA INFO
app.get("/business/:id/profile", isBusiness, getBusiness);

//VER PUNTUACIONES DE NEGOCIO PROPIO
//GET -/BUSINESS/:id/profile/rating
//PRIVADO
app.get("/business/:id/profile/rating", viewOwnBusinessRating);

//EDITAR INFORMACIÓN DE NEGOCIO
//SOLO PARA NEGOCIOS REGISTRADOS
//SI EL USUARIO ES EL MISMO, DEBERÍA PODER EDITAR SU INFO
app.put("/business/:id", isBusiness, editBusiness);

//EDITAR FOTOS DE NEGOCIO
//SOLO PARA NEGOCIOS REGISTRADOS
//SI EL USUARIO ES EL MISMO, DEBERÍA PODER EDITAR SU INFO
app.put("/business/:id/Pictures", isBusiness, editBusinessPictures);

//EDITAR CONTRASEÑA DE NEGOCIO
//SOLO PARA NEGOCIOS REGISTRADOS
//SI EL USUARIO ES EL MISMO, DEBERÍA PODER EDITAR SU INFO
app.put("/business/:id/password", isBusiness, editBusinessPassword);

//RECUPERAR CONTRASEÑA DE NEGOCIO
//SOLO PARA NEGOCIOS REGISTRACIOS
app.post("/business/recover-password", recoverBusinessPassword);

//RESETEAR CONTRASEÑA DE NEGOCIO
//SOLO PARA NEGOCIOS REGISTRACIOS
app.post("/business/reset-password", resetBusinessPassword);

//DESACTIVAR CUENTA DE USUARIO
//PUT - /users/id/deactive
//PRIVADO
app.put("/business/:id/deactive", isUser, deactiveBusiness);

/* ********************************************* */

//BOOKING ENDPOINTS
//ACTION BY USER

//CREAR UNA RESERVA
//POST - /user/:id/booking
//sólo el usuario
app.post("/user/:idUser/business/:idBusiness/booking/", isUser, newBooking);

//LISTAR BOOKINGS DE USUARIO CONFIRMADAS
//GET - /bookings/:id
//sólo el usuario
app.get("/user/:id/booking/", isUser, listUserBookingsConfirmed);

//LISTADO AVANZADO DE BOOKINGS DE USUARIO
//GET - /bookings/:id
//sólo el usuario
app.get("/user/:id/booking_advanced", isUser, listUserBookingsAdvanced);

//LISTAR BOOKINGS DE USUARIO HISTÓRICO
//GET - /bookings/:id
//sólo el usuario
app.get("/user/:id/booking/previous", isUser, listUserBookingsPast);

//CANCELAR RESERVA POR PARTE DEL CLIENTE
//PUT -/user/:idUser/booking/:idBooking
app.put(
  "/user/:idUser/booking/:idBooking/cancelate",
  isUser,
  bookingExists,
  cancelUserBooking
);

//EDITAR UNA RESERVA DETERMINADA DE UN USUARIO
//PUT -/booking/:id
//sólo el usuario que reservó
app.put(
  "/user/:idUser/booking/:idBooking",
  isUser,
  bookingExists,
  editUserBooking
);

//EDITAR LA TC DE UNA RESERVA DETERMINADA POR ERROR EN EL PAGO
//PUT -/bookings/:id/credit-card
//sólo el usuario que reservó
app.put(
  "/user/:idUser/booking/:idBooking/credit_card",
  isUser,
  bookingExists,
  editUserBookingTC
);

//VALORAR UNA RESERVA
//PUT -/bookings/:id
app.put(
  "/user/:idUser/booking/:idBooking/value",
  isUser,
  bookingExists,
  voteBooking
);

/* ********************************************* */

//BOOKING ENDPOINTS
//ACTION BY BUSINESS

//LISTAR BOOKINGS DE NEGOCIO
//GET - /BUSINESS/:ID/BOOKING
//sólo el negocio
app.get("/business/:id/booking", isBusiness, listBusinessBookings);

//LISTAR FILTRANDO BOOKINGS DE NEGOCIO
//GET -/BUSINESS/:id/BOOKING/ADVANCED
app.get(
  "/business/:idBusiness/booking_advanced",
  isBusiness,
  listBusinessBookingsAdvanced
);

//BUSCAR DISPONIBILIDAD
//GET -/BUSINESS/:id/AVAILABILITY
app.get(
  "/business/:idBusiness/availability",
  isBusiness,
  checkBusinessAvailability
);


//LISTAR BOOKINGS DE NEGOCIO
//GET - /BUSINESS/:ID/BOOKING
//sólo el negocio
app.get(
  "/business/:idBusiness/booking/:idBooking",
  isBusiness,
  bookingExists,
  getBusinessBooking
);

//LISTAR BOOKINGS CON LLEGADA DE HOY DE NEGOCIO
//GET - /BUSINESS/:ID/BOOKING/TODAY
app.get(
  "/business/:id/booking_today/",
  isBusiness,
  listBusinessTodayBookings
);
//LISTAR BOOKINGS CON LLEGADA DE MAÑANA DE NEGOCIO
//GET - /BUSINESS/:ID/BOOKING/TOMORROW
app.get(
  "/business/:id/booking_tomorrow/",
  isBusiness,
  listBusinessTomorrowBookings
);

//CHECK IN BOOKING
//PUT -/BUSINESS/:ID/BOOKING/CHECKIN
app.put(
  "/business/:idBusiness/booking/:idBooking/checkin",
  isBusiness,
  bookingExists,
  checkInBooking
);

//MOSTRAR UNA RESERVA DETERMINADA DE UN USUARIO
//GET - /bookings/:
//sólo el usuario
app.get(
  "/user/:idUser/booking/:idBooking/",
  isUser,
  bookingExists,
  getUserBooking
);

//CHECK OUT BOOKING
//PUT - /BUSINESS/:ID/BOOKING/CHECKOUT
app.put(
  "/business/:idBusiness/booking/:idBooking/checkout",
  isBusiness,
  bookingExists,
  checkOutBooking
);

//NO SHOW BOOKING
//PUT - /BUSINESS/:ID/BOOKING/NOSHOW
app.put(
  "/business/:idBusiness/booking/:idBooking/no-show",
  isBusiness,
  bookingExists,
  noShowBooking
);

/* ********************************************* */

//HACER BÚSQUEDAS

//LISTADO MEJORADO ULTRA MEGA TOP
//GET -/BUSINESS
app.get("/business", searchBusinessAvailable);

//VER INFO DE UN BUSINESS
//GET -/BUSINESS/:id
//PÚBLICO
app.get("/business/:id", viewBusiness);

//VER PUNTUACIONES DE UN BUSINESS
//GET -/BUSINESS/:id/rating
//PÚBLICO
app.get("/business/:id/rating", viewBusinessRating);

//VER NEGOCIOS TOP
//GET -/viewtopbusiness
//PÚBLICO
app.get("/viewTopBusiness", viewTopBusiness);

/* ********************************************* */

//ADMIN FUNCIONALIDADES

//LISTADO NEGOCIOS PENDIENTES DE VALIDAR
//GET -/admin/:idAdmin/business/:id/
app.get(
  "/admin/:idAdmin/business-to-activate/",
  isUser,
  isAdmin,
  listBusinessPending
);

//CHECK BUSINESS
//GET -/admin/:idAdmin/business/:id/
app.get(
  "/admin/:idAdmin/business-to-activate/:idBusiness/check",
  isUser,
  isAdmin,
  checkBusiness
);

//VALIDACION DE BUSINESS
//PUT -/BUSINESS/VALIDATION/REGISTRATIONCODE
app.put(
  "/admin/:idAdmin/business-to-activate/:idBusiness/activate",
  isUser,
  isAdmin,
  activateBusiness
);

//VER TODAS LAS RESERVAS
//PUT -/BUSINESS/VALIDATION/REGISTRATIONCODE
app.get(
  "/admin/:idAdmin/bookings",
  isUser,
  isAdmin,
  listBookings
);

//VER TODAS LAS RESERVAS PENDIENTES DE PAGO
//PUT -/BUSINESS/VALIDATION/REGISTRATIONCODE
app.get(
  "/admin/:idAdmin/bookings_pending",
  isUser,
  isAdmin,
  listBookingsPending
);

//VER TODAS LAS RESERVAS PENDIENTES DE PAGO
//PUT -/BUSINESS/VALIDATION/REGISTRATIONCODE
app.put(
  "/admin/:idAdmin/booking/:idBooking/status",
  isUser,
  isAdmin,
  editAdminBooking
);


//VER TODOS LOS NEGOCIOS
//GET -/ADMIN/ID/BUSINESS
app.get(
  "/admin/:idAdmin/business",
  isUser,
  isAdmin,
  listBusiness
);

//VER TODOS LOS NEGOCIOS CON PUNTUACIÓN SUSPENSA
//GET -/ADMIN/ID/BUSINESS
app.get(
  "/admin/:idAdmin/business_bad_reviews",
  isUser,
  isAdmin,
  listBusinessBadRating
);

//VER TODOS LOS USUARIOS
//GET -/ADMIN/ID/USERS
app.get(
  "/admin/:idAdmin/users",
  isUser,
  isAdmin,
  listUsers
);

//ACTIVAR USUARIO COMO ADMINISTRADOR
//PUT -/ADMIN/IDADMIN/USER/IDUSER/ACTIVATE
app.put(
  "/admin/:idAdmin/users/:idUser/activate_admin",
  isUser,
  isAdmin,
  activateAdmin
);

/* ********************************************* */

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

/* ********************************************* */

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`API funcionando en http://localhost:${port} 🙈`);
});
