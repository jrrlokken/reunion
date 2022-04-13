const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const deleteFile = (filePath) => {
  fs.unlink(filePath, (error) => {
    if (error) {
      throw error;
    }
  });
};

const uploadImages = async (images) => {
  for (const image of images) {
    await cloudinary.uploader
      .upload(image.path, { folder: 'reunions' })
      .then((result) => {
        uploadedImages.push(result.secure_url);
      })
      .catch((error) => console.error(error));
  }
};

exports.deleteFile = deleteFile;
exports.uploadImages = uploadImages;
