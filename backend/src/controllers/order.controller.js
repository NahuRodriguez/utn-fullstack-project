const { obtenerRecursos, obtenerRecursoPorId, crearRecurso, modificarRecurso, eliminarRecurso, restaurarRecurso } = require("../utils/http.utils");
const orderSchema = require("../schemas/order.schema");
const productSchema = require("../schemas/product.schema");
const addressSchema = require("../schemas/address.schema");

const obtenerOrders = async (req, res) => {
    await obtenerRecursos(req, res, orderSchema);
};

const obtenerOrderPorId = async (req, res) => {
    try {
        const { id: orderId } = req.params;
        const { id: currentUser, role } = req.user;

        const order = await orderSchema.findById(orderId).populate("items.productId").populate("addressId");

        if (!order) {
            return res.status(404).send({ error: "Orden no encontrada" });
        }

        if (currentUser !== order.userId.toString() && !(role === "ADMIN")) {
            return res.status(403).send({ error: "No tienes permiso para acceder a las órdenes de este usuario" });
        }

        return res.status(200).send(order);
    } catch (error) {
        console.error("Error al obtener la orden:", error);
        return res.status(500).send({ error: "Error interno del servidor" });
    }
};

const crearOrder = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { addressId, items } = req.body;

        // 1. Validar la dirección
        const address = await addressSchema.findById(addressId);
        if (!address) {
            console.error(`Dirección con ID ${addressId} no encontrada`);
            return res.status(404).send({ error: "Dirección no encontrada" });
        }

        // 2. Extraer todos los IDs de productos y obtener sus datos en una sola consulta
        const productIds = items.map((item) => item.productId);
        const dbProducts = await productSchema.find({ _id: { $in: productIds } });  
        
        // Converte el array de la BD en un Mapa (Diccionario) para búsquedas instantáneas
        const productMap = new Map(dbProducts.map((p) => [ p._id.toString(), p ]));

        const payload = {
            userId,
            addressId,
            items: [],
            total: 0
        };

        // 3. Validar stock y procesar ítems en memoria
        for (const item of items) {
            // Buscamos el producto en el mapa
            const product = productMap.get(item.productId);
            
            if (!product) {
                console.error(`Producto con ID ${item.productId} no encontrado en la base de datos`);
                return res.status(404).send({ error: "Uno de los productos seleccionados no existe" });
            }

            // Validar stock disponible
            if (item.quantity > product.stock) {
                console.error(`Cantidad solicitada (${item.quantity}) para ${product.name} excede el stock (${product.stock})`);
                return res.status(400).send({ error: `El producto ${product.name} no tiene suficiente stock disponible` });
            }

            // Calcular totales y estructurar el ítem
            payload.total += item.quantity * product.price;
            
            payload.items.push({
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: product.price
            });

            // DESCUENTO DE STOCK: Modificamos el stock localmente en el documento de Mongoose
            product.stock -= item.quantity;
        }

        // 4. Guardar la Orden en la base de datos
        const order = await orderSchema.create(payload);

        // 5. Guardar los cambios de stock de todos los productos en paralelo
        // Promise.all ejecuta los .save() simultáneamente, ahorrando mucho tiempo de espera
        await Promise.all(dbProducts.map((product) => product.save()));

        // Responder con la orden creada con éxito
        return res.status(201).send(order);

    } catch (error) {
        console.error("Error crítico al crear la orden:", error);
        return res.status(500).send({ error: "Error interno del servidor al procesar la orden" });
    }
};

const eliminarOrder = async (req, res) => {
    await eliminarRecurso(req, res, orderSchema);
};

const restaurarOrder = async (req, res) => {
    await restaurarRecurso(req, res, orderSchema);
}

const obtenerOrderPorUsuario = async (req, res) => {
    const { targetUserId: userId } = req.params;
    const { id: currentUser, role } = req.user;
    
    if (currentUser !== userId && !(role === "ADMIN")) {
        return res.status(403).send({ error: "No tienes permiso para acceder a las órdenes de este usuario" });
    }

    try {
        const orders = await orderSchema.find({ userId });
        return res.status(200).send(orders);
    } catch (error) {
        console.error(`Error al obtener órdenes para el usuario ${userId}:`, error);
        return res.status(500).send({ error: "Error interno del servidor al obtener las órdenes" });
    }
}

module.exports = {
    obtenerOrders,
    obtenerOrderPorId,
    crearOrder,
    eliminarOrder,
    restaurarOrder,
    obtenerOrderPorUsuario
};