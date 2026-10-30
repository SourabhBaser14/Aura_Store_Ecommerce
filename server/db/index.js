const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ecommerce'
});

pool.on('connect', () => {
  console.log('[PostgreSQL]: Connection pool initialized');
});

pool.on('error', (err) => {
  console.error('[PostgreSQL Error]:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect()
};
