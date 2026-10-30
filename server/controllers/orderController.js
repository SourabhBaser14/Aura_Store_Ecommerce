const db = require('../db');

exports.checkout = async (req, res, next) => {
  const client = await db.getClient();
  try {
    const { userId, items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    await client.query('BEGIN');

    let totalAmount = 0;
    const verifiedItems = [];

    for (const item of items) {
      // Row-level lock to prevent concurrent over-allocation
      const prodRes = await client.query(
        'SELECT id, title, price, stock_quantity FROM products WHERE id = $1 FOR UPDATE',
        [item.productId]
      );

      if (prodRes.rows.length === 0) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const product = prodRes.rows[0];
      if (product.stock_quantity < item.quantity) {
        throw new Error(`Insufficient inventory for "${product.title}". Requested: ${item.quantity}, Available: ${product.stock_quantity}`);
      }

      totalAmount += Number(product.price) * item.quantity;
      verifiedItems.push({
        id: item.productId,
        price: product.price,
        quantity: item.quantity
      });

      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, item.productId]
      );
    }

    const paymentIntentId = `pi_aurastore_${Date.now()}`;

    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_amount, payment_status, payment_intent_id)
       VALUES ($1, $2, 'PAID', $3) RETURNING id, created_at`,
      [userId || null, totalAmount, paymentIntentId]
    );
    const order = orderRes.rows[0];

    for (const vItem of verifiedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, unit_price, quantity)
         VALUES ($1, $2, $3, $4)`,
        [order.id, vItem.id, vItem.price, vItem.quantity]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({
      success: true,
      orderId: order.id,
      totalAmount,
      paymentIntentId,
      createdAt: order.created_at,
      message: 'Transaction committed successfully'
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};
