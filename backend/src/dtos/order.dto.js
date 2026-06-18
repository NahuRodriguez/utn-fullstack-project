const { productDTO } = require("./product.dto"); 
const { addressDTO } = require("./address.dto"); 

const orderDTO = (doc) => {
    if (!doc) return null;
    const order = typeof doc.toObject === "function" ? doc.toObject() : doc;
    
    return {
        id: order._id.toString(),
        userId: order.userId ? (typeof order.userId === "object" ? order.userId._id.toString() : order.userId.toString()) : null,
        
        addressId: order.addressId ? (typeof order.addressId === "object" ? addressDTO(order.addressId) : order.addressId.toString()) : null,
        
        items: (order.items || []).map((item) => ({
            productId: item.productId ? (typeof item.productId === "object" ? productDTO(item.productId) : item.productId.toString()) : null,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase
        })),
        total: order.total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
    };
};

module.exports = { orderDTO };