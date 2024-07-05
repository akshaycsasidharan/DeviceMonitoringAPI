import { getDB } from '../connection/connection.js';
import fs from 'fs';
import path from 'path';

export const getProducts = async (req, res) => {

  try {
    const filePath = path.resolve('analytics.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(data);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};


export const addProduct = async (req, res) => {
  try {
    const db = getDB();
    const product = req.body;
    const result = await db.collection('EstroTech').insertOne(product);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};