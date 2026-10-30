const db = require('../db');

exports.getProducts = async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = 'SELECT id, title, description, price, stock_quantity, category, image_url FROM products';
    const params = [];

    if (category && category !== 'All') {
      query += ' WHERE category = $1';
      params.push(category);
    }
    query += ' ORDER BY created_at DESC';

    const { rows } = await db.query(query, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};
