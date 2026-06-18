const categoryDTO = (doc) => {
    if (!doc) return null;
    const cat = typeof doc.toObject === "function" ? doc.toObject() : doc;
    return {
        id: cat._id.toString(),
        name: cat.name,
        description: cat.description || "",
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt
    };
};

module.exports = { categoryDTO };
