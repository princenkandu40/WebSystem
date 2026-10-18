const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'products.db');
const db = new Database(dbPath);

const createTable = [
    'CREATE TABLE IF NOT EXISTS products (',
    'id INTEGER PRIMARY KEY AUTOINCREMENT,',
    'name TEXT NOT NULL,',
    'category TEXT NOT NULL,',
    'price REAL NOT NULL,',
    'brand TEXT NOT NULL,',
    'stock INTEGER NOT NULL,',
    'description TEXT,',
    'created_at DATETIME DEFAULT CURRENT_TIMESTAMP,',
    'updated_at DATETIME DEFAULT CURRENT_TIMESTAMP',
    ');'
].join('\n');

db.exec(createTable);

console.log('Database connected successfully!');
console.log('Products table created successfully!');

module.exports = db;
