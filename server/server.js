const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productController = require('./controllers/productController');
const orderController = require('./controllers/orderController');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/products', productController.getProducts);
app.post('/api/orders/checkout', orderController.checkout);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'AuraStore API' }));

// Centralized Error Boundary Middleware
app.use((err, req, res, next) => {
  console.error('[Error Pipeline]:', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 AuraStore Server running on port ${PORT}`));
