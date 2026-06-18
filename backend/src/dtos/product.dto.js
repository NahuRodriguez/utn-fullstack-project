const { categoryDTO } = require("./category.dto");

const productDTO = (doc) => {
    if (!doc) return null;
    const prod = typeof doc.toObject === "function" ? doc.toObject() : doc;
    return {
        id: prod._id.toString(),
        name: prod.name,
        description: prod.description || "",
        price: prod.price,
        stock: prod.stock,
        imgUrl: prod.imgUrl || "",
        categories: (prod.categories || []).map((c) =>
            typeof c === "object" ? categoryDTO(c) : c.toString()
        ),
        createdBy: prod.createdBy ? (typeof prod.createdBy === "object" ? prod.createdBy._id.toString() : prod.createdBy.toString()) : null,
        createdAt: prod.createdAt,
        updatedAt: prod.updatedAt
    };
};

module.exports = { productDTO };
