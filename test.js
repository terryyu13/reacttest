const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// 連接到 MongoDB
mongoose.connect('mongodb://localhost/todoapp', { useNewUrlParser: true, useUnifiedTopology: true });
const Task = mongoose.model('Task', { text: String });

// GET: 取得所有任務
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST: 新增任務
app.post('/tasks', async (req, res) => {
  const { text } = req.body;
  if (text) {
    try {
      const task = new Task({ text });
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(400).json({ error: 'Invalid task' });
  }
});

// GET: 取得特定任務
app.get('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findById(id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT: 更新特定任務
app.put('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  const { text } = req.body;
  if (text) {
    try {
      const updatedTask = await Task.findByIdAndUpdate(id, { text }, { new: true });
      if (updatedTask) {
        res.json(updatedTask);
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(400).json({ error: 'Invalid task' });
  }
});

// DELETE: 刪除特定任務
app.delete('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deletedTask = await Task.findByIdAndRemove(id);
    if (deletedTask) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
