const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const cloudinary_config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(cloudinary_config);

class Cloudinary {
    static uploadImage = async (dataUri, publicId) => {
        return await cloudinary.uploader.upload(dataUri, {
            public_id: publicId
        });
    };

    static deleteImage = async (imgUrl) => {
        try {
            const parts = imgUrl.split('/');
            const file = parts.pop();
            const decoded = decodeURIComponent(file);
            const publicId = decoded.replace(/\.[^/.]+$/, "");

            const result = await cloudinary.uploader.destroy(publicId);

            console.log(result);
            return result;

        } catch (error) {
            console.error("Error deleting image:", error);
            throw error;
        }
    };
}

module.exports = {
    Cloudinary
};
