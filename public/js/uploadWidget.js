const uploadWidget = cloudinary.createUploadWidget(
  {
    cloudName: 'joloxcloud',
    uploadPreset: 'reunions',
  },
  (error, result) => {
    if (!error && result && result.event === 'success') {
      console.log('Upload result: ', result.info);
    }
  }
);

const openWidget = () => {
  uploadWidget.open();
};

const uploadButton = document.getElementById('upload-button');
uploadButton.addEventListener('click', openWidget);
