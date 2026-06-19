const userDTO = (doc) => {
    if (!doc) return null;
    const user = typeof doc.toObject === "function" ? doc.toObject() : doc;
    return {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || null,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};

module.exports = { userDTO };
