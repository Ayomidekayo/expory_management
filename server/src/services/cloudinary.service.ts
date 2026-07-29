import cloudinary from "../config/cloudinary";

export async function uploadToCloudinary(
  file: Express.Multer.File,
  folder: string
) {
  return new Promise<{
    url: string;
    publicId: string;
  }>((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
  {
    folder,
    resource_type: "auto",
    use_filename: true,
    unique_filename: true,
    filename_override: file.originalname,
  },

  (error, result) => {
    console.log("========== CLOUDINARY ==========");
  console.dir(result, { depth: null });
    console.dir(error, { depth: null });
    console.log("===============================");

    if (error) {
      return reject(error);
    }

    if (!result) {
      return reject(
        new Error("Cloudinary upload failed.")
      );
    }

    resolve({
      url: result.secure_url,
      publicId: result.public_id,
    });
  }
);

    stream.end(file.buffer);
  });
}