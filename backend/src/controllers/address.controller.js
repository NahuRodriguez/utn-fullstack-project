const addressSchema = require("../schemas/address.schema");
const { addressDTO } = require("../dtos");

const obtenerAddresses = async (req, res) => {
    try {
        const results = await addressSchema.find();
        res.status(200).json(results.map(addressDTO));
    } catch (error) {
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const obtenerAddressPorId = async (req, res) => {
    try {
        const { id: addressId } = req.params;
        const { id: currentUserId, role } = req.user;

        const address = await addressSchema.findById(addressId);

        if (!address) {
            return res.status(404).send({ error: "Dirección no encontrada" });
        }

        if (currentUserId !== address.userId.toString() && role !== "ADMIN") {
            return res.status(403).send({ error: "No tienes permiso para acceder a las direcciones de este usuario" });
        }

        return res.status(200).send(addressDTO(address));
    } catch (error) {
        console.error("Error al obtener la dirección:", error);
        return res.status(500).send({ error: "Error interno del servidor" });
    }
};

const crearAddress = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { province, city, postalCode, streetName, buildingNumber } = req.body;

        const addressData = {
            userId,
            province,
            city,
            postalCode,
            streetName,
            buildingNumber
        };

        if (req.body.addressDetails) {
            addressData.addressDetails = req.body.addressDetails;
        }

        const newAddress = await addressSchema.create(addressData);
        return res.status(201).send(addressDTO(newAddress));
    } catch (error) {
        console.error("Error al crear la dirección:", error);
        return res.status(500).send({ error: "Error interno del servidor" });
    }
};

const obtenerAddressPorUsuario = async (req, res) => {
    const { targetUserId: userId } = req.params;
    const { id: currentUser, role } = req.user;

    if (currentUser !== userId && role !== "ADMIN") {
        return res.status(403).send({ error: "No tienes permiso para acceder a las direcciones de este usuario" });
    }

    try {
        const addresses = await addressSchema.find({ userId });
        return res.status(200).send(addresses.map(addressDTO));
    } catch (error) {
        console.error(`Error al obtener direcciones para el usuario ${userId}:`, error);
        return res.status(500).send({ error: "Error interno del servidor al obtener las direcciones" });
    }
};

const eliminarAddress = async (req, res) => {
    const { id: currentUserId, role } = req.user;
    const { id: addressId } = req.params;

    try {
        const address = await addressSchema.findById(addressId);

        if (!address) {
            return res.status(404).send({ error: "Dirección no encontrada" });
        }

        if (currentUserId !== address.userId.toString() && role !== "ADMIN") {
            return res.status(403).send({ error: "No tienes permiso para eliminar las direcciones de este usuario" });
        }

        const recurso = await addressSchema.deleteById(addressId);
        if (!recurso) {
            return res.status(404).send({ error: "Dirección no encontrada" });
        }

        res.status(200).send({ mensaje: "Dirección eliminada" });
    } catch (error) {
        console.error("Error al eliminar la dirección:", error);
        return res.status(500).send({ error: "Error interno del servidor" });
    }
};

const restaurarAddress = async (req, res) => {
    const { id } = req.params;
    try {
        const recurso = await addressSchema.restore({ _id: id });
        if (!recurso) {
            return res.status(404).send({ error: "Dirección no encontrada" });
        }
        res.status(200).send({ mensaje: "Dirección restaurada" });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor" });
    }
};

module.exports = {
    obtenerAddresses,
    obtenerAddressPorId,
    crearAddress,
    eliminarAddress,
    restaurarAddress,
    obtenerAddressPorUsuario
};
