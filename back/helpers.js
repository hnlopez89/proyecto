const { format } = require("date-fns");
const crypto = require("crypto");
const sendgrid = require("@sendgrid/mail");
const path = require("path");
const uuid = require("uuid");
const fs = require("fs").promises;
const sharp = require("sharp");
const imageUploadPath = path.join(__dirname, process.env.UPLOADS_DIR);

function formatDateToDB(date) {
  return format(new Date(date), "yyyy-MM-dd HH:mm:ss");
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

async function processAndSaveImage(uploadedImage) {
  //creamos el directorio (con recursive: true por si hay subdirectorios y así no da error)
  await fs.mkdir(imageUploadPath, { recursive: true });
  // Leer la imagen que se subió
  const image = sharp(uploadedImage.data);
  // saco información de la imagen
  const imageInfo = await image.metada();
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

module.exports = {
  formatDateToDB,
  randomString,
  sendMail,
  processAndSaveImage,
  deleteUpload,
  generateError,
};
