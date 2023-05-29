
const express = require("express");
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const _ = require("lodash")
//app.use(express.json())
const ToDo = require('./model/ToDoModel')
const List = require('./model/ToDoModel')

app.use(express.static("public"));
app.set('view engine', 'ejs');

// Parse JSON bodies for this app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://admin-palo:admin-palo@cluster0.rkdzhdq.mongodb.net/To-Do-List", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const item1 = new ToDo({
  name: "get up"
});

const item2 = new ToDo({
  name: "Take a bath"
});

const item3 = new ToDo({
  name: "Do Pooja-Path"
});

const defaultitems = [item1, item2, item3];


app.get("/", async function (req, res) {
  try {
    const Items = await ToDo.find();
    if (Items.length === 0) {
      await ToDo.insertMany(defaultitems);
      console.log('Successfully added items to the database');
    }
    res.render("list", { list_tile: "ToDay", listitems: Items });
  } catch (error) {
    console.error(error);
  }
});

app.post("/", async function (req, res) {
  try {
    const itemName = req.body.newItem;
    const listName = req.body.list
    console.log(itemName)
    if(listName === "ToDay"){
    await ToDo.create({ name: itemName });
    console.log('New item added in Today list');
    res.redirect("/");
    }else{
      const foundItem = await List.findOne({name:listName});
      foundItem.items.push({name:itemName});
      await foundItem.save();
      res.redirect("/"+listName)
    }
  
  } catch (error) {
    console.error(error);
  }
});

app.post("/delete",async function(req,res){
  try{
    console.log(req.body.checkbox)
  const checkboxValue = req.body.checkbox;
  const [checkeditemId, listName] = checkboxValue.split(',');
   if(listName === "ToDay"){
       await ToDo.deleteOne({ _id: checkeditemId })
       console.log("Item deleted succesfully from ToDay list")
       res.redirect("/")
   }else{
    const foundItem = await List.findOne({name:listName});
    foundItem.items=foundItem.items.filter(item => item._id.toString() !== checkeditemId);
    await foundItem.save();
    console.log(`Item deleted succesfully from ${listName} list`)
    res.redirect("/"+listName)
   }
   //WE CAN ALSO DELETE ITEM USING BELOW CODE
  //  await List.findOneAndUpdate(
  //   { name: listName }, // Find the "work" list by its name
  //   { $pull: { items: { _id: checkedItemId } } }, // Remove the item with the specified ID from the items array
  //   (error, foundList) => {
  //     if (!error) {
  //       console.log("Item deleted successfully");
  //       res.redirect("/"+listName); // Redirect to the "work" list page
  //     }
  //   }
  // );
  }catch(error){console.error(error)}
  
})

app.get("/:listName",async function(req,res){
  try{
    const listName = _.capitalize(req.params.listName)
  const foundItem = await List.findOne({name:listName});
  if(!foundItem){
    await List.create({ 
      name: listName,
      items:defaultitems
    });
    res.redirect("/"+listName)
  }else{
     res.render("list", { list_tile: foundItem.name, listitems: foundItem.items });
}
  }catch(error){console.error(error)}
})


app.listen(3000, function () {
  console.log("server starting on port 3000...");
});
