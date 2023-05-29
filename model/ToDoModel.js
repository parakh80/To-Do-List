const mongoose = require('mongoose');


const ToDoSchema = new mongoose.Schema({
    name: String,
});

const listSchema = {
  name:String,
  items:[ToDoSchema]
}

  const ToDo = mongoose.model('ToDo', ToDoSchema);
  const List = mongoose.model('List', listSchema);
  module.exports = ToDo;
  module.exports = List;
