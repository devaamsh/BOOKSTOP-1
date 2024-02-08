import express from "express";
import {fileURLToPath} from "url";
import {dirname} from "path";
import bodyParser from "body-parser";
import pg from "pg";
import { error } from "console";
let username="";
const db=new  pg.Client({
    user: "postgres",
    host: "localhost",
    database: "BOOKSTOP",
    password: "Deva@2006",
    port: 5432,
});
db.connect();
var app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
const __dirname=dirname(fileURLToPath(import.meta.url));
const port=3000;
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/index.html");
})
app.get("/start",(req,res)=>{
    res.sendFile(__dirname+"/public/login.html");
})
app.post("/submit",async(req,res)=>{
    username=req.body.username;
    let password=req.body.password;
    let passw="";
    try{
    const result='SELECT password FROM users WHERE username=$1;';
    // const values = [username];
    // await db.query(result, values);
    const pass=await db.query(result,[username]);
     passw=pass.rows[0].password;
    if(passw===password){
        res.sendFile(__dirname+"/public/inside.html");
    }else{
        res.render("/start");
    }
}catch(error){
    console.log(error.message);
    res.redirect("/start");
}
});
app.get("/new",(req,res)=>{
    res.sendFile(__dirname+"/public/new.html");
})
app.post("/ok",async(req,res)=>{
     username=req.body.username;
    let password=req.body.password;
    try{
    let query='INSERT INTO users(username,password) VALUES ($1,$2);';
    const values = [username, password];
    await db.query(query, values);
    console.log('User details saved successfully!');
    res.sendFile(__dirname+"/public/login.html");
    }catch(err){
        console.log(err.message);
        res.redirect("/new");
    }
});
app.post("/send",async(req,res)=>{
    let title=req.body.title;
    let description=req.body.description;
    try{
        let query='INSERT INTO book(username,title,description) VALUES ($1,$2,$3);';
        const values = [username,title,description];
        await db.query(query, values);
        const result='SELECT title,description FROM book WHERE username=$1;';
    const pass=await db.query(result,[username]);
        console.log('Book details saved successfully!');
        res.render("index.ejs",{
            books:pass,
        })
        }catch(err){
            console.log(err.message);
            res.sendFile(__dirname+"/public/error.html");
        }
})
app.get("/post",(req,res)=>{
    res.sendFile(__dirname+"/public/inside.html");
})
app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})