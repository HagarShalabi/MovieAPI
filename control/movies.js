/*QUERY BUILDER-knex*/
//DB CONNECTION//
const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : 'localhost',
      port : 3306,
      user : 'root',
      password : '123Socks123',
      database : 'movies_db'
    }
  });
  const table="movies";
/*GET METHOD*/
const select=(request, response)=> {
   knex(table)
   .select(['id', 'name', 'description', 'author'])
   .then((movies)=>{
    response.status(200).json(movies);
   })
   .catch((error)=>{
    console.log(error);
    response.status(500).json("Error in select method");
   });
};

/*DB VALIDATION*/
const joi=require("../../Week 4/node_modules/joi/lib");
const validate=(request, response)=>{
    //Check Body Data
    const mName=request.body.mName;
    const mDescription=request.body.mDescription;
    const mAuthor=request.body.mAuthor;
    // const {title, description}=request.body;

    console.log("Name: ", mName);
    console.log("Description: ", mDescription);
    console.log("Author: ", mAuthor);

    const notesSchema=joi.object({
        mName:joi.string().max(50).required(), 
        mDescription:joi.string().min(0).required(), 
        mAuthor: joi.string().max(50).required()
    });

    const result=notesSchema.validate({mName, mDescription, mAuthor});
    console.log("Result: ", result);
    if(result.error){
        response.status(400).json("Error");
    }

    //Check copies 
    else{
        knex(table)
        .select(['name', 'description', 'author'])
        .where({name:mName})
        .then((movies)=>{
            if(movies[0]!=null){
                response.status(400).json("Copied data");
            }
            else{
                //Insert Data
                knex(table)
                .insert({name:mName, description:mDescription, author:mAuthor})
                .then((movies)=>{
                    console.log(movies);
                    response.status(200).json("Inserted");
                })
                .catch((error)=>{
                    console.log(error);
                    response.status(500).json("Error");
                });
            }
        });
    }
};

/*POST METHOD*/
const create=(request, response)=> {
    const mName=request.body.mName;
    const mDescription=request.body.mDescription;
    const mAuthor=request.body.mAuthor;
    knex(table)
    .insert({name:mName, description:mDescription, author:mAuthor})
    .then((movies)=>{
        response.status(200).json("Created");
       })
    .catch((error)=>{
        console.log(error);
       });
 };

 /*PUT METHOD*/
const update=(request, response)=> {
    const mName=request.body.mName;
    const mDescription=request.body.mDescription;
    const mAuthor=request.body.mAuthor;
    const mID=request.params.id;
     //Validate valid IDs
     const notesSchema=joi.object({
        mName:joi.string().max(50).required(), 
        mDescription:joi.string().min(0).required(), 
        mAuthor: joi.string().max(50).required()
    });
     const result=notesSchema.validate({mName, mDescription, mAuthor});
     console.log("Result: ", result);
     if(result.error){
         return response.status(400).json("Error");
     }
     //Update Data 
     knex(table)
     .update({
        name:mName, description:mDescription, author:mAuthor
     })
     .where({id:mID})
     .then((movies)=>{
         return response.status(200).json("Updated");
        })
     .catch((error)=>{
         console.log(error);
        });
  };

//    /*DELETE METHOD*/
// const Delete=(request, response)=> {
//     const Ntitle=request.body.Ntitle;
//      const Ndescription=request.body.Ndescription;
//      const id=request.params.id;
//      knex("notes")
//      .delete({
//         id:id,
//         title: Ntitle, 
//         description: Ndescription
//     })
//      .where({id:id})
//      .then((notes)=>{
//          response.status(200).json("Deleted");
//         })
//      .catch((error)=>{
//          console.log(error);
//         });
//   };

     /*RECOVER DELETE METHOD*/
const recoverDeleted=(request, response)=> {
     const mID=request.params.id;
     knex(table)
     .select(["name"])
     .update({deleted:'0'})
     .where({id:mID})
     .then((movies)=>{response.status(200).json("Recovered");})
     .catch((error)=>{
         console.log(error);
         response.status(400).json("Error");
        });
  };

       /*TEMP DELETE METHOD*/
const tempDeleted=(request, response)=> {
    const mID=request.params.id;
    knex(table)
    .select(["name"])
    .where({id:mID})
    .then((movies)=>{
        if(movies[0] != null){
            knex(table)
            .update({deleted: "1"})
            .where({id:mID})
            .then((movies)=>{response.status(200).json("Recovered");})
        }
    })
    .catch((error)=>{
        console.log(error);
        response.status(400).json("Error");
       });
 };

module.exports={select, create, update, validate, recoverDeleted, tempDeleted};

