const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database(':memory:');

app.use(cors());
app.use(bodyParser.json());

// Initialize the database
db.serialize(() => {
  db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, status TEXT, timeSpent INTEGER, startTime INTEGER)");
});

// Fetch all tasks
app.get('/api/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, status, timeSpent } = req.body;
  db.run("INSERT INTO tasks (title, description, status, timeSpent) VALUES (?, ?, ?, ?)", [title, description, status, timeSpent], function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ id: this.lastID, title, description, status, timeSpent });
    }
  });
});

// Update task status
app.patch('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { status, timeSpent, startTime } = req.body;
  db.run("UPDATE tasks SET status = ?, timeSpent = ?, startTime = ? WHERE id = ?", [status, timeSpent, startTime, id], function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ updatedID: id, status, timeSpent });
    }
  });
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status, timeSpent, startTime } = req.body;
  db.run("UPDATE tasks SET title = ?, description = ?, status = ?, timeSpent = ?, startTime = ? WHERE id = ?", [title, description, status, timeSpent, startTime, id], function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ updatedID: id, title, description, status, timeSpent });
    }
  });
});


// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ deletedID: id });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
