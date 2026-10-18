const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Test route
app.get('/', (req, res) => {
    res.send('Tech Product Showcase API (Prince Nkandu - 202506829) is running!');
});

// GET all products
app.get('/api/products', (req, res) => {
    try {
        const products = db.prepare(
            'SELECT * FROM products ORDER BY id DESC'
        ).all();

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE a new product
app.post('/api/products', (req, res) => {
    try {
        const { name, category, price, brand, stock, description } = req.body;

        if (!name || !category || price === undefined || !brand || stock === undefined) {
            return res.status(400).json({
                error: 'Name, category, price, brand, and stock are required.'
            });
        }

        const result = db.prepare(`
            INSERT INTO products (name, category, price, brand, stock, description)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(name, category, price, brand, stock, description || '');

        const product = db.prepare(
            'SELECT * FROM products WHERE id = ?'
        ).get(result.lastInsertRowid);

        res.status(201).json({
            message: 'Product added successfully!',
            product: product
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ one product by ID
app.get('/api/products/:id', (req, res) => {
    try {
        const product = db.prepare(
            'SELECT * FROM products WHERE id = ?'
        ).get(req.params.id);

        if (!product) {
            return res.status(404).json({
                error: 'Product not found.'
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE a product
app.put('/api/products/:id', (req, res) => {
    try {
        const { name, category, price, brand, stock, description } = req.body;
        const id = req.params.id;

        const existingProduct = db.prepare(
            'SELECT * FROM products WHERE id = ?'
        ).get(id);

        if (!existingProduct) {
            return res.status(404).json({
                error: 'Product not found.'
            });
        }

        const updatedName = name !== undefined ? name : existingProduct.name;
        const updatedCategory = category !== undefined ? category : existingProduct.category;
        const updatedPrice = price !== undefined ? price : existingProduct.price;
        const updatedBrand = brand !== undefined ? brand : existingProduct.brand;
        const updatedStock = stock !== undefined ? stock : existingProduct.stock;
        const updatedDescription = description !== undefined ? description : existingProduct.description;

        db.prepare(`
            UPDATE products
            SET name = ?, category = ?, price = ?, brand = ?,
                stock = ?, description = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(
            updatedName,
            updatedCategory,
            updatedPrice,
            updatedBrand,
            updatedStock,
            updatedDescription,
            id
        );

        const updatedProduct = db.prepare(
            'SELECT * FROM products WHERE id = ?'
        ).get(id);

        res.json({
            message: 'Product updated successfully!',
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a product
app.delete('/api/products/:id', (req, res) => {
    try {
        const id = req.params.id;

        const result = db.prepare(
            'DELETE FROM products WHERE id = ?'
        ).run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                error: 'Product not found.'
            });
        }

        res.json({
            message: 'Product deleted successfully!'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server AFTER defining all routes
app.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT);
});