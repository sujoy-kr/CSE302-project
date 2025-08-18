const express = require("express");
const router = express.Router();

// POST /admin/buy-food
router.post("/buy-food", async (req, res) => {
  const { food_item_id, supplier_id, quantity } = req.body;
  const db = req.app.locals.db;

  try {
    // Insert into Food_Item_Supply
    const [supplyResult] = await db.query(
      `INSERT INTO Food_Item_Supply (supplier_id, food_item_id, quantity, supply_date)
             VALUES (?,?,?,?)`,
      [supplier_id, food_item_id, quantity, new Date()]
    );

    // Log transaction
    await db.query(
      `INSERT INTO Transactions (type, quantity, transaction_date, food_item_id)
             VALUES (?,?,?,?)`,
      ["purchase", quantity, new Date(), food_item_id]
    );

    res.json({
      message: "Food purchased successfully",
      supply_id: supplyResult.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
