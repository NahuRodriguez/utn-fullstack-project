const orderSchema = require("../schemas/order.schema");
const productSchema = require("../schemas/product.schema");
const addressSchema = require("../schemas/address.schema");
const { orderDTO } = require("../dtos");

const obtenerOrders = async (req, res) => {
    try {
        const results = await orderSchema.find();
        res.status(200).json(results.map(orderDTO));
    } catch (error) {
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const obtenerOrderPorId = async (req, res) => {
    try {
        const { id: orderId } = req.params;
        const { id: currentUser, role } = req.user;

        const order = await orderSchema.findById(orderId).populate("items.productId").populate("addressId");

        if (!order) {
            return res.status(404).send({ error: "Orden no encontrada" });
        }

        if (currentUser !== order.userId.toString() && role !== "ADMIN") {
            return res.status(403).send({ error: "No tienes permiso para acceder a las órdenes de este usuario" });
        }

        return res.status(200).send(orderDTO(order));
    } catch (error) {
        console.error("Error al obtener la orden:", error);
        return res.status(500).send({ error: "Error interno del servidor" });
    }
};

const crearOrder = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { addressId, items } = req.body;

        const address = await addressSchema.findById(addressId);
        if (!address) {
            console.error(`Dirección con ID ${addressId} no encontrada`);
            return res.status(404).send({ error: "Dirección no encontrada" });
        }

        const productIds = items.map((item) => item.productId);
        const dbProducts = await productSchema.find({ _id: { $in: productIds } });

        const productMap = new Map(dbProducts.map((p) => [ p._id.toString(), p ]));

        const payload = {
            userId,
            addressId,
            items: [],
            total: 0
        };

        for (const item of items) {
            const product = productMap.get(item.productId);

            if (!product) {
                console.error(`Producto con ID ${item.productId} no encontrado en la base de datos`);
                return res.status(404).send({ error: "Uno de los productos seleccionados no existe" });
            }

            if (item.quantity > product.stock) {
                console.error(`Cantidad solicitada (${item.quantity}) para ${product.name} excede el stock (${product.stock})`);
                return res.status(400).send({ error: `El producto ${product.name} no tiene suficiente stock disponible` });
            }

            payload.total += item.quantity * product.price;

            payload.items.push({
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: product.price
            });

            product.stock -= item.quantity;
        }

        const order = await orderSchema.create(payload);
        await Promise.all(dbProducts.map((product) => product.save()));

        return res.status(201).send(orderDTO(order));
    } catch (error) {
        console.error("Error crítico al crear la orden:", error);
        return res.status(500).send({ error: "Error interno del servidor al procesar la orden" });
    }
};

const eliminarOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const recurso = await orderSchema.deleteById(id);
        if (!recurso) {
            return res.status(404).send({ error: "Orden no encontrada" });
        }
        res.status(200).send({ mensaje: "Orden eliminada" });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor" });
    }
};

const restaurarOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const recurso = await orderSchema.restore({ _id: id });
        if (!recurso) {
            return res.status(404).send({ error: "Orden no encontrada" });
        }
        res.status(200).send({ mensaje: "Orden restaurada" });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor" });
    }
};

const obtenerOrderPorUsuario = async (req, res) => {
    const { targetUserId: userId } = req.params;
    const { id: currentUser, role } = req.user;

    if (currentUser !== userId && role !== "ADMIN") {
        return res.status(403).send({ error: "No tienes permiso para acceder a las órdenes de este usuario" });
    }

    try {
        const orders = await orderSchema.find({ userId });
        return res.status(200).send(orders.map(orderDTO));
    } catch (error) {
        console.error(`Error al obtener órdenes para el usuario ${userId}:`, error);
        return res.status(500).send({ error: "Error interno del servidor al obtener las órdenes" });
    }
};

module.exports = {
    obtenerOrders,
    obtenerOrderPorId,
    crearOrder,
    eliminarOrder,
    restaurarOrder,
    obtenerOrderPorUsuario
};
