const mongoose = require("mongoose");
const orderSchema = require("../schemas/order.schema");

const crearProductoEnOrden = async (req, res) => {
    const orderId = req.params.orderId;
    try {
        if (!req.body.productId) {
            return res.status(400).json({mensaje: "Se requiere productId del item a crear"});
        }
        const doc = await orderSchema.findById(orderId);
        if (!doc) {
            return res.status(404).json({mensaje: "Order doesn't exist"});
        }
        if (doc.items.find((item) => item.productId == productId )) {
            return res.status(400).json({mensaje: "Product exists in items, try modifying the resource"});
        }
        doc.items.push(req.body);
        await doc.save();
        res.status(201).json({mensaje: "Item creado", item: doc});
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ errors: error.errors });
        } else {
            res.status(500).json({mensaje: "Internal Server Error"});
        }
    }
};

const modificarProductoEnOrden = async (req, res) => {
    const orderId = req.params.orderId;
    const productId = req.params.productId;
    try {
        const doc = await orderSchema.findById(orderId).exec();
        if (!doc) {
            return res.status(404).json({ mensaje: "Order no encontrado" });
        }
        let relevantItem = null;
        for (item of doc.items) {
            if (item.productId == productId) {
                relevantItem = item;
            }
        }
        if (!relevantItem) {
            return res.status(404).json({ mensaje: "No se encontró una entrada para el Product referenciado en el Order referenciado" });
        }
        doc.items.pull(relevantItem);
        const newItem = Object.assign(relevantItem, { ...req.body });
        doc.items.push(newItem);
        await doc.save();
        res.status(201).json({mensaje: "Item modificado", item: doc});
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ errors: error.errors });
        } else {
            res.status(500).json({mensaje: "Internal Server Error"});
        }
    }
};

const eliminarProductoEnOrden = async (req, res) => {
    const orderId = req.params.orderId;
    const productId = req.params.productId;
    try {
        const doc = await orderSchema.findById(orderId).exec();
        if (!doc) {
            return res.status(404).json({ mensaje: "Order no encontrado" });
        }
        let relevantItem = null;
        for (item of doc.items) {
            if (item.productId == productId) {
                relevantItem = item;
            }
        }
        if (!relevantItem) {
            return res.status(404).json({ mensaje: "No se encontró una entrada para el Product referenciado en el Order referenciado" });
        }
        doc.items.pull(relevantItem);
        await doc.save();
        res.status(201).json({mensaje: "Item eliminado", item: doc});
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ errors: error.errors });
        } else {
            res.status(500).json({mensaje: "Internal Server Error"});
        }
    }
};

module.exports = {
    crearProductoEnOrden,
    modificarProductoEnOrden,
    eliminarProductoEnOrden
}