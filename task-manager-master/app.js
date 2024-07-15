const express = require('express');
const app = express();
const port = 3030;
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store
let tasks = require('./task.json').tasks;

// GET /tasks: Retrieve all tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
  });
  
  // GET /tasks/:id: Retrieve a single task by its ID
  app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (task) {
      res.status(200).json(task);
    } 
    else {
      res.status(404).json({ error: 'Task not found' });
    }
  });
  
  // Helper function to write tasks to file
const saveTasksToFile = (tasks) => {
    fs.writeFileSync('task.json', JSON.stringify({ tasks }, null, 2));
  };

  // POST /tasks: Create a new task
  app.post('/tasks', (req, res) => {
    const { title, description, completed } = req.body;
    if (!title || !description || typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const newTask = {
      id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
      title,
      description,
      completed
    };
    tasks.push(newTask);
    saveTasksToFile(tasks);

    const checkifnewidexists = tasks.findIndex(t => t.id === newTask.id);
    if(checkifnewidexists)
    {
    res.status(201).json({
        message: 'New task created successfully for task id :' + newTask.id
      });
    }
    else
    {
        res.status(500).json({
            message: 'Something went wrong, please try again!!'
          });
    }
  });
  
  // PUT /tasks/:id: Update an existing task by its ID
  app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, description, completed } = req.body;
    if (!title || !description || typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    tasks[taskIndex] = { id: taskId, title, description, completed };
    saveTasksToFile(tasks);
    res.status(200).json({message: 'Tasks uodated successfully for task id: ' + taskId});
  });
  
  // DELETE /tasks/:id: Delete a task by its ID
  app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    tasks.splice(taskIndex, 1);
    saveTasksToFile(tasks);
    res.status(204).send({message: 'Task_id: ' + tasks.id + 'has been deleted from the records!'});
  });
  
  app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;