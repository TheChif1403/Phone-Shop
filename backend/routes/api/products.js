import express from "express";
import fs from "fs/promises";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json()); // For parsing JSON request bodies

app.get("/api/products", async (req, res) => {
  try {
    const data = await fs.readFile("./data/products.json", "utf-8");
    const products = JSON.parse(data);
    res.json(products);
  } catch (error) {
    console.error("Error reading products.json:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
