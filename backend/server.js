const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");

const port = 4001;
const index = require("./routes/index");

const db = {};
const user = {};

const msgDB = {};

const app = express();
app.use(index);
app.use(cors())

const server = http.createServer(app);

const io = socketIo(server,{cors:{origin:"*"}});

io.on("connection", (socket) => {
  console.log('New connection',socket.id)
  socket.on('ID',data=>{
    db[socket.id]=data;
    user[data]=socket.id;
    socket.broadcast.emit("userId",{[socket.id]:data});
    let newdb = {...db};
    delete newdb[socket.id];
    socket.emit("userId",newdb);
    // console.log(msgDB);
    let arr = Object.keys(msgDB).filter(k=>k.endsWith(data));
    // console.log(arr);
    // console.log("users",user);
    // arr.forEach(sr=>{
    //   data={[socket.id]:msgDB[sr]};
    //   socket.emit("msg-client",data);
    // })
  })
  socket.on('msg-server',data=>{
    let id = Object.keys(data)[0];
    msgDB[`${db[socket.id]}->${db[id]}`]=data[id];
    console.log(msgDB);
    data={[socket.id]:msgDB[`${db[socket.id]}->${db[id]}`]};
    // console.log(data);
    socket.to(id).emit('msg-client',data);
  })
  socket.on('disconnect',data=>{
    // console.log("i am disconnected",socket.id);
    delete db[socket.id];
  })
});


server.listen(port, () => console.log(`Listening on port ${port}`));