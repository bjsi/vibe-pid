
import { useState } from "react";
import PidTuner from "../components/PidTuner/PidTuner";
import PageLayout from "../components/Layout/PageLayout";
import ImageUpload from "../components/PidTuner/ImageUpload";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <PageLayout>
      <div className="w-full space-y-6">
        <PidTuner />
        <ImageUpload onImageUpload={handleImageUpload} />
        {uploadedImage && (
          <div className="rounded-lg border bg-card p-4">
            <img
              src={uploadedImage}
              alt="Uploaded content"
              className="max-h-[400px] w-full rounded-lg object-contain"
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Index;
