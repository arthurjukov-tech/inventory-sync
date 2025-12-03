import express from "express";
import cors from "cors";
import { supabase } from "./supabase.js";

const app = express();
app.use(cors());
app.use(express.json());

// Root - return JSON like an API
app.get("/", (req, res) => {
  res.json({ service: "inventory-sync", status: "running" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw error;
    res.json(data ?? []);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

// Add product (example)
app.post("/products", async (req, res) => {
  try {
    const payload = req.body; // e.g. { title, sku, price_cents, category, images }
    const { data, error } = await supabase.from("products").insert([payload]).select();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

// Update product or stock (example)
app.patch("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from("products").update(updates).eq("id", id).select();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
