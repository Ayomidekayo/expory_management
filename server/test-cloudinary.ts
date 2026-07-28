import cloudinary from "./src/config/cloudinary";

async function testUpload() {
  try {
    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    );

    console.log("✅ Upload successful");
    console.log(result);
  } catch (error) {
    console.error("❌ Upload failed");
    console.dir(error, { depth: null });
  }
}

testUpload();