const db = require('./database');

const products = [
    ['HP Laptop', 'Electronics', 7500, 'HP', 10, 'Laptop for students'],
    ['Samsung Galaxy A15', 'Smartphones', 3200, 'Samsung', 15, 'Affordable smartphone'],
    ['Dell Monitor', 'Accessories', 1800, 'Dell', 8, 'Computer monitor'],
    ['Logitech Mouse', 'Accessories', 250, 'Logitech', 25, 'Wireless computer mouse'],
    ['Lenovo ThinkPad', 'Electronics', 9500, 'Lenovo', 6, 'Business laptop'],
    ['iPhone 13', 'Smartphones', 8500, 'Apple', 5, 'Apple smartphone'],
    ['HP Keyboard', 'Accessories', 300, 'HP', 20, 'USB keyboard'],
    ['Canon Printer', 'Printers', 2200, 'Canon', 7, 'Office printer'],
    ['JBL Headphones', 'Audio', 650, 'JBL', 12, 'Wireless headphones'],
    ['SanDisk Flash Drive', 'Storage', 180, 'SanDisk', 30, '64GB USB flash drive']
];

const insertProduct = db.prepare(`
    INSERT INTO products (name, category, price, brand, stock, description)
    VALUES (?, ?, ?, ?, ?, ?)
`);

const insertMany = db.transaction((items) => {
    for (const product of items) {
        insertProduct.run(...product);
    }
});

insertMany(products);

console.log('10 sample products added successfully!');

db.close();