import multer from "multer";
import { existsSync, mkdirSync } from "fs";
import path from "path";

const UPLOAD_FOLDER = path.join(__dirname, "../../uploads");

if (!existsSync(UPLOAD_FOLDER)) {
  mkdirSync(UPLOAD_FOLDER);
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "src/uploads/");
  },
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// TODO: add filter for allowed file types
const upload = multer({ storage });

export default upload;
