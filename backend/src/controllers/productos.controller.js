const productSchema = require("../schemas/product.schema");
const { productDTO } = require("../dtos");
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
            data: results.map(productDTO),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const recurso = await productSchema.findById(id).populate("categories");
        if (!recurso) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.status(200).json(productDTO(recurso));
    } catch (error) {
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const crearProducto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ mensaje: "No se subió ninguna imagen" });
        }

        const { buffer, mimetype } = req.file;
        const newProduct = await productSchema.create(req.body);

        const base64 = buffer.toString("base64");
        const dataUri = `data:${mimetype};base64,${base64}`;
        const imagenGuardada = await Cloudinary.uploadImage(dataUri, newProduct._id.toString());

        newProduct.imgUrl = imagenGuardada.secure_url;
        await newProduct.save();

        res.status(201).json({
            mensaje: "Producto creado con éxito",
            data: productDTO(newProduct)
        });
    } catch (err) {
        console.error("Error al crear producto: ", err);
        res.status(500).json({ mensaje: "Error interno del servidor", error: err.message });
    }
};

const modificarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const oldDoc = await productSchema.findById(id).exec();
        if (!oldDoc) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        Object.assign(oldDoc, req.body);
        const recurso = await oldDoc.save();
        res.status(200).json({ mensaje: "Producto actualizado", data: productDTO(recurso) });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const recurso = await productSchema.deleteById(id);
        if (!recurso) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.status(200).json({ mensaje: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const restaurarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const recurso = await productSchema.restore({ _id: id });
        if (!recurso) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.status(200).json({ mensaje: "Producto restaurado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    modificarProducto,
    eliminarProducto,
    restaurarProducto
};
