const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });


const isAuthenticated = (socket, next) => {
    const query = socket.handshake.query;

    if (query && query.token){
        jwt.verify(query.token, "d2c7eae4b025a186db0f1c8490c946a9f50e5a4a3c08e769a93d22f3785bbf3d", (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
            next();
        });
    }
    else {
        next(new Error('Authentication error'));
    }    
};

io.use(isAuthenticated);

io.on("connection", (socket)=>{
   
    socket.on("chat", (messageObj) =>{

        const sql = "INSERT INTO message(user_id, message_text) VALUES(?, ?)";

        con.query(sql, [user_id, message_text], (err, result)=>{
            
            if(!err){
                io.emit("chat", messageObj);
            }
            else{
                io.emit("chat", {user_id: 0, message_text: "Server Error"});
            }
            
        });

        io.emit("chat", messageObj);
    });
    socket.on("disconnect", ()=>{
        console.log("User disconnected");
    });
});

server.listen(3002, ()=>{
    console.log("Server running on PORT 3002");
});
