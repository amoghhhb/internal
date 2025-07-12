const express = require("express");
const path = require("path");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to PostgreSQL DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/save-name", async (req, res) => {
  const { fullName } = req.body;
  if (!fullName) return res.status(400).json({ message: "Full name is required" });

  try {
    await pool.query("INSERT INTO users(full_name) VALUES($1)", [fullName]);
    res.status(200).json({ message: "Name saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
