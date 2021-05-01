import express from "express";
import expressAsyncHandler from "express-async-handler";
import Gridfsstorage from "multer-gridfs-storage";
import multer from "multer";
import dotenv from "dotenv";
import { gfs } from "../server.js";
import { gridFSBucket } from "../server.js";
dotenv.config();

const ImageRouter = express.Router();

const storage = new Gridfsstorage({
  url: process.env.MONGODB_URI,
  file: (req, file, err) => {
    return new Promise((resolve, reject) => {
      if (err) {
        return reject(err);
      }
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: "uploads",
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage });

ImageRouter.post(
  "/",
  upload.single("image"),
  expressAsyncHandler((req, res) => {
    console.log(req.file);
    res.status(200).send("Image Added!!!!!");
  })
);

ImageRouter.get(
  "/:filename",
  expressAsyncHandler(async (req, res) => {
    await gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "No file exists",
        });
      }
      if (
        file.contentType === "image/jpeg" ||
        file.contentType === "image/png"
      ) {
        const readstream = gridFSBucket.openDownloadStreamByName(file.filename);
        let data = "";
        readstream.on("data", (chunk) => {
          data += chunk.toString("base64");
        });
        readstream.on("end", () => {
          res.send(data);
        });
      } else {
        res.status(404).json({
          err: "Not an image",
        });
      }
    });
  })
);

ImageRouter.delete(
  "/:filename",
  expressAsyncHandler(async (req, res) => {
    await gfs.files.findOneAndDelete({ filename: req.params.filename });
    res.send("File Deleted!");
  })
);

export default ImageRouter;
