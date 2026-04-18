const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB por archivo
});

const multerImage = upload.single("image"); // 'image' es el nombre del campo en el formulario

module.exports = {
    multerImage
};