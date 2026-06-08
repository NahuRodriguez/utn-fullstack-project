const { obtenerRecursos, obtenerRecursoPorId, crearRecurso, modificarRecurso, eliminarRecurso } = require("../utils/http.utils");
const productSchema = require("../schemas/product.schema");
const { Cloudinary } = require("../config/cloudinary");

const obtenerProductos = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.category) {
            filter.categories = req.query.category;
        }
        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: "i" };
        }

        const sortMap = {
            "name-asc": { name: 1 },
            "name-desc": { name: -1 },
            "price-asc": { price: 1 },
            "price-desc": { price: -1 },
            "stock-desc": { stock: -1 },
        };
        const sort = sortMap[req.query.sort] || {};

        const [ results, total ] = await Promise.all([
            productSchema.find(filter).sort(sort).populate("categories").skip(skip).limit(limit),
            productSchema.countDocuments(filter)
        ]);

        res.status(200).json({
            data: results,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        send500(res);
    }
};

const obtenerProductoPorId = async (req, res) => {
    const idParam = req.params.id;
    try {
        const recurso = await productSchema.findById(idParam).populate("categories");
        if (!recurso) {
            return res.status(404).json({ mensaje: `${productSchema.modelName} no encontrado` });
        }
        res.status(200).json(recurso);
    } catch (error) {
        send500(res);
    }
};

const crearProducto = async (req, res) => {
    try {
        // 1. Validar que el archivo llegó correctamente
        if (!req.file) {
            return res.status(400).json({ mensaje: "No se subió ninguna imagen" });
        }

        // 2. Extraer buffer y mimetype directamente de req.file
        const { buffer, mimetype } = req.file;

        // 3. Crear el producto (usando req.body que ya fue procesado por multer)
        const newProduct = await productSchema.create(req.body);

        // 4. Convertir a Data URI para Cloudinary
        const base64 = buffer.toString("base64");
        const dataUri = `data:${mimetype};base64,${base64}`;

        // 5. Subir a Cloudinary (usando el ID del producto como referencia)
        const imagenGuardada = await Cloudinary.uploadImage(dataUri, newProduct._id.toString());

        // 6. Actualizar el campo imgUrl y guardar
        newProduct.imgUrl = imagenGuardada.secure_url;
        await newProduct.save();

        // 7. Respuesta al cliente
        res.status(201).json({ 
            mensaje: "Producto creado con éxito", 
            [`${productSchema.modelName}`]: newProduct 
        });

    } catch (err) {
        console.error("Error al crear producto: ", err);
        res.status(500).json({ mensaje: "Error interno del servidor", error: err.message });
    }
};


const modificarProducto = async (req, res) => {
    await modificarRecurso(req, res, productSchema);
};

const eliminarProducto = async (req, res) => {
    await eliminarRecurso(req, res, productSchema);
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    modificarProducto,
    eliminarProducto
};