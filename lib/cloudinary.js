export const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", process.env.CLOUDINARY_PRESET);
  data.append("cloud_name", process.env.CLOUDINARY_CLOUD_NAME);

  // 📌 File type automatically handled by Cloudinary
  // If it's a PDF, resource_type must be 'raw'
  const resourceType = file.type === "application/pdf" ? "raw" : "image";

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    {
      method: "POST",
      body: data,
    }
  );

  const response = await res.json();
  if (!response.secure_url) throw new Error("Upload failed!");
  return response.secure_url;
};