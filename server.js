/*Web server- Express.js & http*/
const express=require("express");
const morgan=require("morgan");

const app=express();
app.get("/", (request, response)=>{
    response.status(200).json("Server running!");
});

const router=require("./route/movies");
app.use(morgan("dev"));
app.use("/api/movies", router);
app.use(express.json()); /*Acts as a body parser*/

const http=require("http");
const server=http.createServer(app);
server.listen(3000);
console.log("Server running at port 3000");
