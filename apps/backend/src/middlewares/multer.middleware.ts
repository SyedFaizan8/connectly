import multer, { StorageEngine } from "multer";
import { Request, Response } from "express";

// Define the storage configuration with types
const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: Function) {
    cb(null, "./public/temp");
  },
  filename: function (req: Request, file: Express.Multer.File, cb: Function) {
    cb(null, file.originalname);
  }
});

// Export the multer instance with storage configuration
export const upload = multer({
  storage,
});
