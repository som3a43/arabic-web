import React from "react";
import { ImageUploadPage } from "../components/ImageUploadPage";

interface ImagesPageProps {}

export const ImagesPage: React.FC<ImagesPageProps> = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <ImageUploadPage />
    </div>
  );
};

export default ImagesPage;
