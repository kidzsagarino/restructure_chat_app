const express = require("express");

const cors = require("cors");    

const jwt = require("jsonwebtoken");

const app = express();

const mysql = require("mysql2");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chat_db"
});

app.use(express.json());
app.use(cors());

const isAuthenticated = (req, res, next) =>{
    const token = req.header("Authorization");

    jwt.verify(token, "d2c7eae4b025a186db0f1c8490c946a9f50e5a4a3c08e769a93d22f3785bbf3d", (err, user) => {
        if (err) {
          return res.status(403).json({ code_number: 403, message: "Forbidden: Invalid token" });
        }
    
        req.user = user;

        next();
      });
}

app.get("/", (req, res) =>{
    res.json({message: "Backend is ready!"});
});


app.post("/login", (req, res) =>{

    const { user_email, user_password}  = req.body;

    const sql = "SELECT user_id, user_name FROM user WHERE user_email = ? AND user_password = ?";

    con.query(sql, [user_email, user_password], (err, result) =>{

        console.log(result);

        if(!err){
            if(result.length > 0){

                const token = jwt.sign({ user_id: result.user_id }, "d2c7eae4b025a186db0f1c8490c946a9f50e5a4a3c08e769a93d22f3785bbf3d", { expiresIn: "24h" });
                console.log(token);
                return res.status(200).json({message: result, codeNumber: 1, token: token});
            }

            return res.status(200).json({message: "Invalid username or password", codeNumber: 0});
        }



        return res.status(500).json({message: "Server Error"});
    });
});


app.post("/register", (req, res) =>{

    const { user_name, user_email, user_password } = req.body;

    const sql = "INSERT INTO user(user_name, user_email, user_password) VALUES(?, ?, ?)";

    con.query(sql, [user_name, user_email, user_password], (err, result) =>{

        if(!err){
            return res.status(200).json({message: "Registered successfully"});
        }

        return res.status(500).json({message: "Server error"});

    });

});

app.get("/convo", isAuthenticated ,(req, res) =>{
    const sql = "SELECT user_id, message_text FROM message";

    con.query(sql, (err, result) =>{
        if(!err){
            return res.status(200).json(result);
        }

        return res.status(500).json({message: "Server Error"});

    });
});



app.listen(3001, ()=>{
    console.log("Server Running On Port 3001");
});
