import React from "react";
import { ImageUploadPage } from "../components/ImageUploadPage";

export const ImagesPage: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <ImageUploadPage />
    </div>
  );
};

export default ImagesPage;
