const express = require("express");
const path = require('path');
// const {connection} = require("./config/db")
// const nodemailer = require('nodemailer');
const { connection } = require("./config/db");
const cors = require("cors");
const nodemailer = require('nodemailer');
const { userRoute } = require("./routes/user.route");const app = express();
const http = require("http");


const httpserver = http.createServer(app);
// connection

app.use(express.json())
app.use(cors())
app.use("/user",userRoute)
const { emit } = require("process");
const {Server} = require("socket.io");



app.get("/",(req,res)=>{
    res.send("welcome")
})




const io = new Server(httpserver);
var obj = {}
io.on("connection",async (socket)=>{
    console.log("client connected")

    socket.on("details",(res)=>{
        console.log(res.room_no)
        obj[socket.id] = res.room_no
        socket.join(res.room_no)
    })
    socket.on("message",(res)=>{
        console.log(res)
        io.to(obj[socket.id]).emit("recive",res)
    })

    
})

httpserver.listen(8080,async ()=>{
    await connection
    console.log("server is running")
 });