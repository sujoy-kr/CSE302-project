const express = require("express");
const router = express.Router();

// GET all transactions
router.get("/", async (req, res) => {
  const db = req.app.locals.db;
  try {
    const [rows] = await db.query(
      "SELECT * FROM Transactions ORDER BY transaction_date DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// POST add a transaction
router.post("/", async (req, res) => {
  const db = req.app.locals.db;
  const { type, quantity, food_item_id } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO Transactions (type, quantity, transaction_date, food_item_id) VALUES (?,?,?,?)",
      [type, quantity, new Date(), food_item_id]
    );
    res.json({ transaction_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
