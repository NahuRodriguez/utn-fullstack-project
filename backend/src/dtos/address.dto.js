const addressDTO = (doc) => {
    if (!doc) return null;
    const addr = typeof doc.toObject === "function" ? doc.toObject() : doc;
    return {
        id: addr._id.toString(),
        userId: addr.userId ? (typeof addr.userId === "object" ? addr.userId._id.toString() : addr.userId.toString()) : null,
        province: addr.province,
        city: addr.city,
        postalCode: addr.postalCode,
        streetName: addr.streetName,
        buildingNumber: addr.buildingNumber,
        addressDetails: addr.addressDetails || null,
        createdAt: addr.createdAt,
        updatedAt: addr.updatedAt
    };
};

module.exports = { addressDTO };
