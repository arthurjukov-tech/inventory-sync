import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabase.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Inventory Sync API is running');
});

app.post('/products', async (req, res) => {
  const { name, description, price, category, image_url } = req.body;

  const { data, error } = await supabase
    .from('products')
    .insert([{ name, description, price, category, image_url }])
    .select();

  if (error) return res.status(400).json({ error });
  res.json(data);
});

app.get('/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(400).json({ error });
  res.json(data);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
