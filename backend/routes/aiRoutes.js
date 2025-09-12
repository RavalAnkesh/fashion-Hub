import express from "express";
import multer from "multer";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import '@tensorflow/tfjs-backend-cpu'; // CPU backend for Node

import fs from "fs";
import { Image, createCanvas, loadImage } from "canvas"; // needed for Node image decoding

const router = express.Router();
const upload = multer();

// Load MobileNet
let model;
(async () => {
  await tf.setBackend('cpu');
  model = await mobilenet.load();
  console.log("✅ AI Model Loaded (CPU backend)");
})();

// Category mapping
const categoryMap = [
  { keywords: ["t-shirt", "shirt", "hoodie", "jacket"], category: "Men", subCategory: "Topwear" },
  { keywords: ["pant", "jean", "trouser"], category: "Men", subCategory: "Bottomwear" },
  { keywords: ["kurta", "dress", "saree"], category: "Women", subCategory: "Ethnicwear" },
  { keywords: ["shoe", "sneaker", "boot"], category: "Men", subCategory: "Footwear" },
  { keywords: ["kid"], category: "Kids", subCategory: "Topwear" },
];

// Decode image using canvas
async function decodeImage(buffer) {
  const img = await loadImage(buffer);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return tf.browser.fromPixels(canvas);
}

router.post("/ai-classify", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded" });
    if (!model) return res.status(500).json({ success: false, message: "AI model not ready yet" });

    const tensor = await decodeImage(req.file.buffer);
    const predictions = await model.classify(tensor);
    const topPrediction = predictions[0]?.className || "unknown";

    // Map prediction to category
    let predictedCategory = "Men";
    let predictedSubCategory = "Topwear";
    const lower = topPrediction.toLowerCase();
    for (const map of categoryMap) {
      if (map.keywords.some(k => lower.includes(k))) {
        predictedCategory = map.category;
        predictedSubCategory = map.subCategory;
        break;
      }
    }

    console.log("🔎 AI Prediction:", topPrediction);
    res.json({ success: true, predictedCategory, predictedSubCategory, rawPrediction: topPrediction });

  } catch (err) {
    console.error("❌ AI Error:", err);
    res.status(500).json({ success: false, message: "AI category suggestion failed" });
  }
});

export default router;
