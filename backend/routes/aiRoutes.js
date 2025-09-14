import express from "express";
import multer from "multer";
import * as tf from "@tensorflow/tfjs-node";
import * as mobilenet from "@tensorflow-models/mobilenet";
import sharp from "sharp";

const router = express.Router();
const upload = multer();

// Load MobileNet model on server start
let model;
(async () => {
  model = await mobilenet.load();
  console.log("✅ AI Model Loaded (Node backend)");
})();

// Category mapping
const categoryMap = [
  { keywords: ["t-shirt","shirt","hoodie","jacket","top","sweatshirt"], category: "Men", subCategory: "Topwear" },
  { keywords: ["pant","jean","trouser","short"], category: "Men", subCategory: "Bottomwear" },
  { keywords: ["blouse","kurta","dress","top"], category: "Women", subCategory: "Topwear" },
  { keywords: ["skirt","legging","jean"], category: "Women", subCategory: "Bottomwear" },
  { keywords: ["kid","child","t-shirt"], category: "Kids", subCategory: "Topwear" },
  { keywords: ["kid","child","pant"], category: "Kids", subCategory: "Bottomwear" },
];

// Dominant color detection using Sharp
async function getDominantColor(buffer) {
  const { data, info } = await sharp(buffer)
    .resize(50, 50) // small image for faster processing
    .raw()
    .toBuffer({ resolveWithObject: true });

  let r = 0, g = 0, b = 0;
  const pixelCount = info.width * info.height;

  for (let i = 0; i < data.length; i += info.channels) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }

  r = Math.round(r / pixelCount);
  g = Math.round(g / pixelCount);
  b = Math.round(b / pixelCount);

  return `rgb(${r},${g},${b})`;
}

// AI classify route
router.post("/ai-classify", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded" });
    if (!model) return res.status(500).json({ success: false, message: "AI model not ready" });

    // Decode image for TensorFlow
    const tensor = tf.node.decodeImage(req.file.buffer);
    const predictions = await model.classify(tensor);
    const topPrediction = predictions[0]?.className || "unknown";

    // Map to category / subcategory
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

    // Get dominant color
    const color = await getDominantColor(req.file.buffer);

    res.json({
      success: true,
      predictedCategory,
      predictedSubCategory,
      color,
      rawPrediction: topPrediction
    });
  } catch (err) {
    console.error("❌ AI Error:", err);
    res.status(500).json({ success: false, message: "AI detection failed" });
  }
});

export default router;
