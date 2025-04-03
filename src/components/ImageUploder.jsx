import React, { useState } from "react";
import axios from "axios";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const handleImageUpload = async () => {
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("file", image);
    formData.append("fileName", image.name);
    formData.append("publicKey", "public_CR/ezdEuoxQuW3Uvwr6XxEERkuE="); // Replace with your Public API Key

    try {
      const response = await axios.post(
        "https://upload.imagekit.io/api/v1/files/upload",
        formData
      );
      setUploadedImageUrl(response.data.url);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleImageUpload}>Upload to ImageKit</button>
      {uploadedImageUrl && <img src={uploadedImageUrl} alt="Uploaded" />}
    </div>
  );
};

export default ImageUploader;
