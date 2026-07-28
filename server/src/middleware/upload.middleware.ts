import multer from "multer";
import path from "path";
import fs from "fs";

/*
=====================================
Upload Directory
=====================================
*/

const uploadPath = path.join(
  process.cwd(),
  "uploads",
  "documents"
);

/*
=====================================
Create Folder if it doesn't exist
=====================================
*/

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

/*
=====================================
Storage
=====================================
*/

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadPath);
  },

  filename(_req, file, cb) {
    const uniqueName =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

/*
=====================================
Allowed File Types
=====================================
*/

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];

  if (
    allowedMimeTypes.includes(file.mimetype)
  ) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Only PDF, PNG and JPG files are allowed."
    )
  );
};

/*
=====================================
Upload Middleware
=====================================
*/

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export default upload;