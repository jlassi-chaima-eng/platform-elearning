// const express = require("express");
// const app = express();
// const bodyparser=require("body-parser");
// const cors=require("cors");
// const mysql = require('mysql');

// app.use(cors());

// app.use(express.json());
// app.use(bodyparser.urlencoded({extended:true}));
// app.use(bodyparser.json());
// const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
     "elearning",
     "root",
    "",
  {
    host: "localhost",
    dialect: "mysql",
    operatorsAliases: false,

    pool: {
      max:  5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.matiere = require("../models/matiere.model.js")(sequelize, Sequelize);
db.niveau = require("../models/niveau.model.js")(sequelize, Sequelize);
db.formation = require("../models/Formation.model.js")(sequelize, Sequelize);
db.ContenuFormation=require("../models/Contenu-formation.model.js")(sequelize, Sequelize);
db.EtablissementEnseignement=require("../models/Etablissement.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
  });
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
  });
//niveau
db.matiere.belongsTo(db.niveau, {});
db.user.belongsTo(db.niveau, {});
//niveau
db.niveau.hasMany(db.user);
db.niveau.hasMany(db.matiere);
//Etablissement

db.user.belongsTo(db.EtablissementEnseignement, {});
db.EtablissementEnseignement.hasMany(db.user);
db.matiere.belongsTo(db.EtablissementEnseignement, {});
db.EtablissementEnseignement.hasMany(db.matiere);
//formation
db.matiere.hasMany(db.formation,{onDelete:'cascade'});
db.formation.belongsTo(db.matiere, {
  foreignKey: "matiereId",
  as: "matiere",
}); 
db.formation.hasMany(db.ContenuFormation,{onDelete:'cascade'});
db.ContenuFormation.belongsTo(db.formation, {
  foreignKey: "formationId",
  as: "formation",
});  
  
  db.ROLES = ["user", "admin", "professeur","superAdmin"];
  
  module.exports = db;
//CREATE CONNECTION
// const db =mysql.createConnection({
//     host: 'localhost',
//     user :'root',
//     password:''  ,
//     database:'crudNodeReact'
// });
// db.connect((err)=> {
//       if(err){
//           throw err;
//        }
//        console.log('Mysql Connected....');
// });
//create db
// app.get('/dbcreate',(req,res)=>  {
//     let sql ='CREATE DATABASE crudNodeReact';
//     console.log("create db");
//     db.query(sql,(err,result)=>{
//         if(err) throw err;
//         console.log(result);
//         res.send('crud-node-react created');
//     })
// });
// //create user
// app.get('/users',(req,res)=>{
//     let sql ='CREATE TABLE users (id int AUTO_INCREMENT,nom  VARCHAR(255) NOT NULL,prenom VARCHAR(255) NOT NULL,email  VARCHAR(255) NOT NULL,passord  VARCHAR(255) NOT NULL,contact  VARCHAR(255) NOT NULL,date  Date NOT NULL,niveau VARCHAR(255)  NULL,grade VARCHAR(255) NULL,specialite  VARCHAR(255)  NULL,matiere VARCHAR(255)  NULL,PRIMARY KEY(id))';
//     db.query(sql,(err,result)=>{
//         if (err) throw err;
//         console.log(result);
//         res.send('contact table created...');
//     });
// });

// //create table CONTACT
// app.get('/CreateCONTACT',(req,res)=>{
//     let sql ='CREATE TABLE contact (id int AUTO_INCREMENT,name  VARCHAR(255) NOT NULL,email  VARCHAR(255) NOT NULL,contact  VARCHAR(255) NOT NULL,PRIMARY KEY(id))';
//     db.query(sql,(err,result)=>{
//         if (err) throw err;
//         console.log(result);
//         res.send('contact table created...');
//     });
// });
// //get contact
// app.get('/get',(req,res)=>{
//     let sql= "select * from contact";
//     db.query(sql,(err,result)=>{
//         if (err) throw err;
//         console.log(result);
//         res.send(result )

//     })
// })
// // Insert
// app.post('/insert',(req,res)=>{
//     // console.log("tt",req.body["name"])
//     const {name,email,contact}=req.body;
//     console.log("fff"+req.body.name)

//     let sql="INSERT INTO contact( name, email, contact) VALUES (?,?,?)";
//     db.query(sql,[name,email,contact],(err,result)=>{
//         if (err) throw err;
//         console.log(result);
//         res.send('Insert contact table ')
//     })
//    })
//    //delete
// app.delete('/api/remove/:id',(req,res)=>{
//     const { id }=req.params;
//     let sql="DELETE FROM `contact` WHERE id=?";
//     db.query(sql,id,(err,result)=>{
//         if (err) throw err;
//         console.log(result);
//         res.send('delete contact table ')
//     })
//    })
// // get par  id
// app.get('/get/:id',(req,res)=>{
//     const { id }=req.params;
//     let sql= "select * from contact where id=?";
//     db.query(sql,id,(err,result)=>{
//         if (err) throw err;
//         console.log(result);
//         res.send(result )

//     })
// })
// //update
// app.put('/api/update/:id',(req,res)=>{
//     const { id }=req.params;
//     const {name,email,contact}=req.body;
//     let sql="UPDATE `contact` SET `name`=?,`email`=?,`contact`=? WHERE id=?";
//     db.query(sql,[name,email,contact,id],(err,result)=>{
//         if (err) throw err;
//         console.log(result);
//         res.send('update contact table ')
//     })
//    })
// app.listen(5000,()=>{console.log("server is runing on port 5000 ")});
