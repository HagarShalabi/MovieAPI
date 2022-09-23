/*HANDLES ROUTES VIA EXPRESS.JS!*/
const express=require("express");

const route=express.Router();
const control=require("../control/movies");

route.get("/", control.select);
route.post("/", control.create);
route.put("/:id", control.update);
route.delete("/:id",control.Delete); /*tempDeleted is better irl*/
// route.add("/:id",control.validate);
route.patch("/:id",control.recoverDeleted);

module.exports=route;
