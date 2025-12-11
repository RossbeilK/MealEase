// server/routes/upload.routes.js
import express from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import Image from "../models/image.model.js";

const router = express.Router();

// 使用内存存储，把文件直接存到 MongoDB Atlas
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 仅已登录用户可以上传食物图片（如果需要可以再加 role === 'admin' 判断）
router.post("/image", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const img = await Image.create({
      data: req.file.buffer,
      contentType: req.file.mimetype || "image/jpeg",
    });

    // 返回一个可以访问图片的 URL，前端存到 menuItem.imageUrl 里
    const imageUrl = `/api/images/${img._id}`;
    return res.status(201).json({ imageUrl });
  } catch (err) {
    console.error("Upload image error:", err);
    return res.status(500).json({ message: "Upload failed." });
  }
});

export default router;
