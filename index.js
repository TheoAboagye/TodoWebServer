import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import TodoModel from "./todoschema/todo_schema.js"

const app =express()
dotenv.config()
app.use(cors())

const port=process.env.PORT|| 9000
const url=process.env.DB_URL
app.use(express.json())
//Connection method to Database
mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{ 
    //if database is connected successfully
    console.log("Database connected successfully.....")
}).catch((error)=>{
    console.log(error)
})
///home route
app.get("/",(req,res)=>{
    res.send("Welcome to AB Todo API")
})
//Get all Todos route
app.get("/getAllTodos",async(req,res)=>{
const todo=await TodoModel.find({});

if(todo){

  return  res.status(200).json(todo)
}else{
  return  res.status(400).json({
        message:"Faileed to fetch todos from database"
    })
}
})

///create a new Todo into database
app.post("/createTodo",async(req,res)=>{
    const{title,description,isCompleted}=req.body
    const createTodo=await TodoModel.create({
        title,
        description,
        isCompleted
    })
    if(createTodo){
      return res.status(201).json({
          message:"Todo created successfully",
          data:createTodo
      })
    }else{
        return res.status(204).json({
            message: "Failed to create a new Todo"
        })
    }
})
app.patch("/updateTodo/:id",async(req,res)=>{
    const {id}=req.params;
    const {isCompleted}=req.body
    const updateTodo=await TodoModel.updateOne({isCompleted:isCompleted}).where({_id:id})
if(updateTodo){
    return res.status(201).json({
        message:"Todo updated successfully",
        data:updateTodo
    })
}else{
    return res.status(400).json({
        message:"Failed to update Todo"
    })
}
})

app.delete("/deleteTodo/:id",async(req,res)=>{
    const {id}=req.params
    const deleteTodo=await TodoModel.findByIdAndDelete({_id:id})
    if(deleteTodo){
        return res.status(200).json({
            message:"Todo deleted susccessfully",
            data:deleteTodo
        })}else{
            return res.status(400).json({
                message:"failed to delete todo"
            })
        }
})

app.listen(port,()=>{
    console.log(`running at ${port}`)
});
