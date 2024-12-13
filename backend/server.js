const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db/knex");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN, // .env'den IP alınıyor
    methods: ["GET", "POST", "DELETE"], // Desteklenen HTTP metodları
    allowedHeaders: ["Content-Type"], // Desteklenen header'lar
  })
);
app.use(express.json());

// Health Check endpoint
app.get("/health", async (req, res) => {
  try {
    // Veritabanına basit bir sorgu göndererek bağlantıyı kontrol et
    await db.raw("SELECT 1+1 AS result");
    res.status(200).json({
      status: "up",
      message: "Server and database are healthy",
      timestamp: new Date(),
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(500).json({
      status: "down",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// GET /todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await db("todos").select("*").orderBy("id");
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /todos
app.post("/todos", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text alanı zorunludur" });
  }

  try {
    const [newTodo] = await db("todos").insert({ text }).returning("*");
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /todos/:id
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await db("todos").where({ id }).del().returning("*");
    if (!deletedTodo.length) {
      return res.status(404).json({ error: "Todo bulunamadı" });
    }
    res.json(deletedTodo[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
