// server/routes/image.routes.js
import express from "express";
import Image from "../models/image.model.js";

const router = express.Router();

// GET /api/images/:id - 返回图片二进制数据
router.get("/:id", async (req, res) => {
  try {
    const img = await Image.findById(req.params.id);
    if (!img) {
      return res.status(404).end();
    }
    res.set("Content-Type", img.contentType || "image/jpeg");
    return res.send(img.data);
  } catch (err) {
    console.error("Get image error:", err);
    return res.status(500).end();
  }
});

export default router;
