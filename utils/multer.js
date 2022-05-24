const multer = require('multer');

// le indicamos a multer q vamos a guardar en memoryStorage, nos habilita trabajar con la img en los archivos controladores para posteriormente subirlas a la nube
const storage = multer.memoryStorage();

// creamos una insatncia de multer nesesita un objeto como argumento, el storage y una funcion de filtrado q es opcional
const upload = multer({ storage });

module.exports = { upload };
