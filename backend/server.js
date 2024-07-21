const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(express.json())
app.use(cors());

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
    
});



mongoose.connect('mongodb://localhost:27017/mern-app').then(() => {
    console.log("db connected");
    
}).catch(err => console.log(err))

const todoSchema = new mongoose.Schema({
    title:{
        required: true,
        type: String,
    },
    description: {
        required: true,
        type: String,
    }
})

const todoModel = new mongoose.model('todo', todoSchema);



app.post('/todos',async (req, res) => {

    const {title, description} = req.body;

    try {
        const newTodo = new todoModel({title, description})
        await newTodo.save()
        res.status(201).json(newTodo); 
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})

app.get('/todos', async(req, res) => {
    try {
      const todos =await todoModel.find();
      res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})

app.put('/todos/:id', async(req, res) => {
    try {
        const {title, description} = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
        id,
        {title,description},
        {new: true}
        )
        if(!updatedTodo){
            return res.status(404).json({message: "not found"});
        }
        res.json(updatedTodo);
        res.status(200).json();
    } catch (error) {
        console.log(error);
        
        res.status(500).json({message: error.message});
    }
})

app.delete('/todos/:id',async(req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
    
})