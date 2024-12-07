const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Çevre değişkenlerini yükle
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Health Check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'up',
        timestamp: new Date(),
        uptime: process.uptime(),
        message: 'Server is healthy'
    });
});

// In-memory todos array (Gerçek uygulamada bir veritabanı kullanılmalı)
let todos = [];
let nextId = 1;

// GET /todos - Tüm todoları getir
app.get('/todos', (req, res) => {
    res.json(todos);
});

// POST /todos - Yeni todo ekle
app.post('/todos', (req, res) => {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: 'Text alanı zorunludur' });
    }

    const newTodo = {
        id: nextId++,
        text,
        completed: false,
        createdAt: new Date()
    };

    todos.push(newTodo);
    res.status(201).json(todos);
});

// DELETE /todos/:id - Todo sil
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    
    todos = todos.filter(todo => todo.id !== id);
    
    if (todos.length === initialLength) {
        return res.status(404).json({ error: 'Todo bulunamadı' });
    }
    
    res.json(todos);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
