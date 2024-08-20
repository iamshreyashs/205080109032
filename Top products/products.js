const express = require('express');
const axios = require('axios');
const uuid = require('uuid'); // To generate unique IDs

const app = express();
const PORT = 9876;

// Mock function to fetch products from e-commerce APIs
async function fetchProductsFromECommerce(category) {
    // Replace with actual API calls
    // Example: 
    // const response = await axios.get(https://api.example.com/products?category=${category});
    return [
        // Example data
        { id: 1, name: 'Product 1', price: 100, rating: 4.5, discount: 10, company: 'Company A' },
        { id: 2, name: 'Product 2', price: 150, rating: 4.0, discount: 5, company: 'Company B' },
        // ...more products
    ];
}

// Route to get top N products
app.get('/categories/:categoryname/products', async (req, res) => {
    const { categoryname } = req.params;
    let { n, page = 1, sort, minPrice = 0, maxPrice = Infinity } = req.query;
    
    // Ensure 'n' is an integer and set default value
    n = parseInt(n, 10) || 10;
    
    // Fetch products from e-commerce APIs
    const products = await fetchProductsFromECommerce(categoryname);

    // Filter by price range
    const filteredProducts = products.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );

    // Sort products
    if (sort) {
        const [sortField, sortOrder] = sort.split(':');
        filteredProducts.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortField] - b[sortField];
            } else {
                return b[sortField] - a[sortField];
            }
        });
    }

    // Add unique ID to each product
    const productsWithIds = filteredProducts.map(product => ({
        ...product,
        uniqueId: uuid.v4()
    }));

    // Pagination
    const totalProducts = productsWithIds.length;
    const totalPages = Math.ceil(totalProducts / n);
    if (page > totalPages) {
        return res.status(400).json({ error: 'Page number exceeds total pages' });
    }
    
    const startIndex = (page - 1) * n;
    const paginatedProducts = productsWithIds.slice(startIndex, startIndex + n);

    // Send response
    res.json({
        totalProducts,
        totalPages,
        page,
        products: paginatedProducts
    });
});

app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});
