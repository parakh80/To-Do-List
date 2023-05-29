require('dotenv').config();

const ToDO = require('./../model/ToDoModel')

// Create a task
exports.createToDo = async (req, res) => {
  try{
  
      const task = await ToDO.create(req.body);
      res.status(201).json({message: 'Task created successfully',task});
    } catch (error) {
      res.status(500).json({ error: 'Could not create task' });
    }
  };
