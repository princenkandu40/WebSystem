const API_URL = '/api/products';

const productForm = document.getElementById('product-form');
const productsList = document.getElementById('products-list');
const message = document.getElementById('message');
const formTitle = document.getElementById('form-title');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-button');

// Keep track of the product being edited (null if creating a new one)
let editingProductId = null;

function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? '#c62828' : '#16803c';
}

async function loadProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Could not load products.');
        }

        const products = await response.json();
        productsList.replaceChildren();

        if (products.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');

            cell.colSpan = 8;
            cell.textContent = 'No products available.';
            row.appendChild(cell);
            productsList.appendChild(row);
            return;
        }

        products.forEach(product => {
            const row = document.createElement('tr');

            const values = [
                product.id,
                product.name,
                product.category,
                'K' + Number(product.price).toFixed(2),
                product.brand,
                product.stock,
                product.description || ''
            ];

            values.forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actionsCell = document.createElement('td');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-button';
            editButton.addEventListener('click', () => editProduct(product));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', () => deleteProduct(product.id));

            actionsCell.append(editButton, deleteButton);
            row.appendChild(actionsCell);
            productsList.appendChild(row);
        });
    } catch (error) {
        showMessage(error.message, true);
    }
}

// Function to handle form submission for both creating and updating
productForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const product = {
        name: document.getElementById('name').value.trim(),
        category: document.getElementById('category').value.trim(),
        price: parseFloat(document.getElementById('price').value),
        brand: document.getElementById('brand').value.trim(),
        stock: parseInt(document.getElementById('stock').value, 10),
        description: document.getElementById('description').value.trim()
    };

    try {
        let response;
        if (editingProductId) {
            // Update existing product (PUT request)
            response = await fetch(`${API_URL}/${editingProductId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
        } else {
            // Create new product (POST request)
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
        }

        if (!response.ok) {
            throw new Error('Failed to save product.');
        }

        showMessage(editingProductId ? 'Product updated successfully!' : 'Product created successfully!');
        resetForm();
        loadProducts();
    } catch (error) {
        showMessage(error.message, true);
    }
});

// Function to populate form when editing
function editProduct(product) {
    editingProductId = product.id;
    document.getElementById('name').value = product.name;
    document.getElementById('category').value = product.category;
    document.getElementById('price').value = product.price;
    document.getElementById('brand').value = product.brand;
    document.getElementById('stock').value = product.stock;
    document.getElementById('description').value = product.description || '';

    formTitle.textContent = 'Edit Product';
    submitButton.textContent = 'Update Product';
    cancelButton.style.display = 'inline-block';
}

// Function to delete a product
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete product.');
        }

        showMessage('Product deleted successfully.');
        loadProducts();
    } catch (error) {
        showMessage(error.message, true);
    }
}

// Function to reset form state
function resetForm() {
    productForm.reset();
    editingProductId = null;
    formTitle.textContent = 'Add Product';
    submitButton.textContent = 'Add Product';
    cancelButton.style.display = 'none';
}

cancelButton.addEventListener('click', resetForm);

// Initial load
loadProducts();