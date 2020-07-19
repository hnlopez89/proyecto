const { format, addMinutes } = require("date-fns");
const crypto = require("crypto");
const sendgrid = require("@sendgrid/mail");
const path = require("path");
const uuid = require("uuid");
const fs = require("fs").promises;
const sharp = require("sharp");

function formatDateTimeToDB(date) {
  let internalDate;
  if (typeof date === "string") {
    internalDate = new Date(date);
  } else {
    internalDate = date;
  }
  const adjustedDate = addMinutes(
    internalDate,
    internalDate.getTimezoneOffset()
  );
  return format(adjustedDate, "yyyy-MM-dd HH:mm:ss");
}
function minutesToDB(minutes) {
  return minutes * 100
}

function formatDateToDB(date) {
  let internalDate;
  if (typeof date === "string") {
    internalDate = new Date(date);
  } else {
    internalDate = date;
  }
  const adjustedDate = addMinutes(
    internalDate,
    internalDate.getTimezoneOffset()
  );
  return format(adjustedDate, "yyyy-MM-dd");
}

function randomString(length = 20) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

async function sendMail({ email, title, content }) {
  // Configurar api key de sendgrid
  sendgrid.setApiKey(process.env.SENDGRID_KEY);

  // Configurar mensaje
  const message = {
    to: email,
    from: process.env.SENDGRID_FROM,
    subject: title,
    text: content,
    html: `
    <div>
    <h1>${title}</h1>
    <p>${content}</p>
    </div>
    `,
  };
  await sendgrid.send(message);
}

const imageUploadPath = path.join(__dirname, process.env.UPLOADS_DIR);
async function processAndSaveImage(uploadedImage) {
  //creamos el directorio (con recursive: true por si hay subdirectorios y así no da error)
  await fs.mkdir(imageUploadPath, { recursive: true });
  // Leer la imagen que se subió
  const image = sharp(uploadedImage.data);
  // saco información de la imagen
  const imageInfo = await image.metadata();
  // cambiarle el tamaño si es necesario
  if (imageInfo.width > 1000) {
    image.resize(1000);
  }
  const imageFileName = `${uuid.v4()}.jpg`;

  await image.toFile(path.join(imageUploadPath, imageFileName));

  return imageFileName;
}

async function deleteUpload(uploadedImage) {
  await fs.unlink(path.join(imageUploadPath, uploadedImage));
}

function generateError(message, code = 500) {
  const error = new Error(message);
  error.httpStatus = code;
  return error;
}

function showDebug(message) {
  if (process.env.NODE_ENV === "development") {
    console.log(message);
  }
}

module.exports = {
  formatDateTimeToDB,
  formatDateToDB,
  minutesToDB,
  randomString,
  sendMail,
  processAndSaveImage,
  deleteUpload,
  generateError,
  showDebug,
};
