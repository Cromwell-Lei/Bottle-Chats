const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// 解析 JSON 数据
app.use(express.json());
app.use(express.static('public'));

// 初始化数据库
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
    // 创建瓶子表
    db.run(`CREATE TABLE IF NOT EXISTS bottles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    // 创建回复表
    db.run(`CREATE TABLE IF NOT EXISTS replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bottleId INTEGER,
        reply TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bottleId) REFERENCES bottles(id)
    )`);
});

// 投出漂流瓶
app.post('/bottles', (req, res) => {
    const { message } = req.body;
    db.run('INSERT INTO bottles (message) VALUES (?)', [message], function(err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, id: this.lastID });
    });
});

// 打捞漂流瓶
app.get('/bottles', (req, res) => {
    db.get('SELECT * FROM bottles ORDER BY RANDOM() LIMIT 1', (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        if (row) {
            res.json({ success: true, id: row.id, message: row.message });
        } else {
            res.json({ success: false, message: '暂无漂流瓶' });
        }
    });
});

// 回复漂流瓶
app.post('/replies', (req, res) => {
    const { bottleId, reply } = req.body;
    db.run('INSERT INTO replies (bottleId, reply) VALUES (?, ?)', [bottleId, reply], function(err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, id: this.lastID });
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});