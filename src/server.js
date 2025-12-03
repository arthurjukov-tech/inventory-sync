import express from "express";
import cors from "cors";
import { supabase } from "./supabase.js";

const app = express();
app.use(cors());
app.use(express.json());

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Get all products
app.get("/products", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Add product
app.post("/products", async (req, res) => {
  const { name, price, stock } = req.body;

  const { data, error } = await supabase
    .from("products")
    .insert([{ name, price, stock }]);

  if (error) return res.status(500).json({ error });
  res.json(data);
});

// Update stock
app.patch("/products/:id", async (req, res) => {
  const { stock } = req.body;
  const { id } = req.params;

  const { data, error } = await supabase
    .from("products")
    .update({ stock })
    .eq("id", id);

  if (error) return res.status(500).json({ error });
  res.json(data);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
