const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    const [result] = await db.query(
      "INSERT INTO tasks (title, description) VALUES (?, ?)",
      [title, description]
    );
    console.log(result)
    const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [
      result.insertId,
    ]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Database error" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    await db.query(
      "UPDATE tasks SET title=?, description=?, completed=? WHERE id=?",
      [title, description, completed, id]
    );
    const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Database error" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM tasks WHERE id=?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
