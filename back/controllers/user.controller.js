const db = require("../models");
const nodemailer = require('nodemailer');
// const config = require("../config/auth.config");
//secret: "bezkoder-secret-key"
//login google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('974348447556-esrimbovonc62r5pkg2lo2ghsck0vcml.apps.googleusercontent.com');
//stripa
const stripe = require("stripe")("sk_test_51LVYcmEQyRIbZLR8mICQCRk2ww0WCzr2DdrHUpImUTrqLrGNz8cIerKJpLzNNS9CwXsry7k2UhWma5Vf7bwR8YCM00TRRwE2Z5")
const upload = require("../middleware/uplaod");
const GoogleDriveFileUploader =require("./googleDriveService/uploadTogoogle");
var fs =require('fs')
const { GoogleAuth } = require('google-auth-library');
var {google} =require('googleapis')
var  drive = google.drive("v2")
const Readable=require('stream')
const path = require('path')
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { file } = require("googleapis/build/src/apis/file");
const { EtablissementEnseignement } = require("../models");
const User = db.user;
const Matiere = db.matiere;
const Niveau= db.niveau;
const Op = db.Sequelize.Op;
const Role=db.role
const Formation=db.formation
const ContenuFormation=db.ContenuFormation

// const uploadFile=require("../routes/user.routes");

exports.getFormationEnLigne = (req, res) => {
  // res.status(200).send("Public Content.");
  const niveauId=req.params.niveauId;
  const etablissementenseignementId=req.params.etablissementenseignementId
  console.log(etablissementenseignementId+"rrr")
  var arr=[];
  const isEnligne="1"
  
  Formation.findAll({where:{isEnligne:isEnligne},include:{model:Matiere,as:"matiere",where:{niveauId:niveauId,etablissementenseignementId:etablissementenseignementId}}}).then((data)=>{
    
    // res.send(data)
       
    //   data.forEach((value) => {
    //     arr.push(value.id)
    //     console.log(arr)
    //   });
    // Formation.findAll({where:
    //   {matiereId:{[Op.or]:arr}}}).then( (resp)=>{
       
       res.send(data)
      //  console.log(resp)
        }           
    )
  
//  })
};
exports.allAccess = (req, res) => {
    // res.status(200).send("Public Content.");
    const niveauId=req.params.niveauId;
    const etablissementenseignementId=req.params.etablissementenseignementId
    console.log(etablissementenseignementId+"rrr")
    var arr=[];
    Formation.findAll({where:{isEnligne:"0"},include:{model:Matiere,as:"matiere",where:{niveauId:niveauId,etablissementenseignementId:etablissementenseignementId}}}).then((data)=>{
      
      // res.send(data)
         
      //   data.forEach((value) => {
      //     arr.push(value.id)
      //     console.log(arr)
      //   });
      // Formation.findAll({where:
      //   {matiereId:{[Op.or]:arr}}}).then( (resp)=>{
         
         res.send(data)
        //  console.log(resp)
          }           
      )
    
//  })
  };
  
  exports.userBoard = (req, res) => {
    // const niveauId = req.query.niveauId;
console.log(req.params.etablissementenseignementId,req.params.niveauId+"cc")
    Matiere.findAll({where:{niveauId:req.params.niveauId,
      etablissementenseignementId:req.params.etablissementenseignementId}}  ).then((data)=>{
      if(data){
      res.send(data);}
    else{
      res.send("erreur");
    }})
    // res.status(200).send("User Content.");
  };
 
  exports.getMatieresSAdmin= (req, res) => {
   
    Matiere.findAll({}  ).then((data)=>{
      if(data){
      res.send(data);
    
    console.log(data+"hhhh")
    }
    else{
      res.send("erreur");
    }})
    // res.status(200).send("User Content.");
  };

  exports.findbyNiveau = (req, res) => {
    // const niveauId = req.query.niveauId;
console.log(req.params.niveauId)
    Matiere.findAll({where:{niveauId:req.params.val,etablissementenseignementId:req.params.etablissementenseignementId}}  ).then((data)=>{
      if(data){
      res.send(data);}
    else{
      res.send("erreur");
    }})
    // res.status(200).send("User Content.");
  };
  //recherche par ecoles les admin
  exports.findbyEcole = (req, res) => {
  
    
var arr=[]

    User.findAll({include:[{model:Role,where:{name:"admin"}} ,{model:EtablissementEnseignement,where:{id:req.params.val}}]} ).then(user=>{
//       var nomEtab=[]
// user.forEach(value=>{
//   if (value.etablissementenseignementId==req.params.val){
//     console.log(value.etablissementenseignementId)
//     arr.push(value)
//   }
// })

// EtablissementEnseignement.findAll({where:{id:req.params.val}}).then((res)=>{
//    nomEtab.push(res[0].nom)
//   //  res.send(nomEtab+arr+"iii")
// })
// console.log(nomEtab+"rrr")
// Object.assign(response.data, { roles: [roles] })
res.send(user)
      
       
      });
}
//getNiveau
exports.GetNiveau = (req, res) => {

Niveau.findAll({include:{model:Matiere,include:{model:EtablissementEnseignement}}}).then((data)=>{
  if(data){
  res.send(data);
console.log(data)}
else{
  res.send("erreur");
}})
}
exports.AjouterNiveau = (req, res) => {
console.log(req.body.niveau)
Niveau.create({name:req.body.niveau})
.then(data => {
console.log(data.name)
  res.send({message:`${data.name} ajouté avec succès`});
})
.catch(err => {
  res.status(500).send({
    message:
      err.message || "Some error occurred while creating the Matiere."
  });
});
};
exports.AjouterEcole = (req, res) => {
  console.log(req.body.NomEcole ,req.body.AdresseEcole,  req.file.filename,req.body.Largeur)
  EtablissementEnseignement.create({nom:req.body.NomEcole,adresse:req.body.AdresseEcole,  image:req.file.filename,ver:req.body.Hauteur,hor:req.body.Largeur})
  .then(data => {
  console.log(data.name)
    res.send({message:`${data.nom} ajouté avec succès`});
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Matiere."
    });
  });
  };
  exports.ModifierEcole = (req, res) => {
    console.log(req.body.NomEcole ,req.body.AdresseEcole,  req.file.filename)
    EtablissementEnseignement.update({nom:req.body.NomEcole,adresse:req.body.AdresseEcole,  image:req.file.filename,ver:req.body.Hauteur,hor:req.body.Largeur},{where:{id:req.params.id}})
    .then(data => {

      res.send({message:` Modifier avec succès`});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Matiere."
      });
    });
    };
  
exports.DeleteNiveau = (req, res) => {
  const id = req.params.id;

  Niveau.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Niveau a été supprimée avec succès!"
        });
      } else {
        res.send({
          message: `Cannot delete Niveau with id=${id}. Maybe Niveau was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Niveau with id=" + id
      });
    });
};
exports.DeleteEcole = (req, res) => {
  const id = req.params.id;

  EtablissementEnseignement.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Etablissement d'Enseignement a été supprimée avec succès!"
        });
      } else {
        res.send({
          message: `Cannot delete Niveau with id=${id}. Maybe Niveau was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Niveau with id=" + id
      });
    });
};
//ecole
exports.GetEtablissement = (req, res) => {

  EtablissementEnseignement.findAll().then((data)=>{
    if(data){
    res.send(data);
  // console.log(data)
}
  else{
    res.send("erreur");
  }})
  }
  exports.GetEtablissementProfil = (req, res) => {
const id=req.params.etablissementenseignementId;


    EtablissementEnseignement.findAll({where:{id:id}}).then((data)=>{
      if(data){
      res.send(data);
    // console.log(data)
  }
    else{
      res.send("erreur");
    }})
  console.log(id+"rrr")
  //  
 }
  
exports.GetEtablissementbyId= (req, res) => {

  EtablissementEnseignement.findAll({where:{id:req.params.id}}).then((resp)=>{
   res.send(resp)
   
 })

}
  exports.AjouterNiveau = (req, res) => {
  console.log(req.body.niveau)
  Niveau.create({name:req.body.niveau})
  .then(data => {
  console.log(data.name)
    res.send({message:`${data.name} ajouté avec succès`});
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Matiere."
    });
  });
  };
  

// get admin
exports.findbyAdmin = (req, res) => {
  
    
  var arr=[]
      User.findAll({include:[{model:Role,where:{name:"admin"}} ,{model:EtablissementEnseignement}]} ).then(user=>{

  res.send(user)
        
         
        });
  }
  exports.AjouterAdmin = (req, res) => {
  User.create({
    username: req.body.username,
    prenom: req.body.prenom,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    contact: req.body.contact,
    date: req.body.date,
    etablissementenseignementId: req.body.ecole,
    roles:"admin",
    dateExpiration:req.body.dateExp,
  })
  .then(user => {
   
      Role.findAll({
        where: {
          name: 
             "admin"
          
        }
      }).then(roles => {
        console.log(roles)
        user.setRoles(roles).then(() => {
          res.send(`admin ${req.body.username} ajouter avec succees`);
        });
      });
    })
}
exports.UpdateAdmin = (req, res) => {
  const id =req.params.id
  User.update({
    username: req.body.username,
    prenom: req.body.prenom,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    contact: req.body.contact,
    date: req.body.date,
    etablissementenseignementId: req.body.ecole,
    dateExpiration:req.body.dateExp,
    roles:"admin",
  },{where: { id: id }}).then(
          res.send(`admin ${req.body.username} modifier avec succees`)
       
  )
}

  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.SuperAdminBoard = (req, res) => {
    res.status(200).send("SuperAdmin Content.");
  };
  exports.profBoard = (req, res) => {
    res.status(200).send("Professeur Content.");
  };

  
  exports.updateAdminProfil= (req,res)=>{
    // await uploadFile(req, res);
      // let fileType=req.file.mimetype.split("/")[1];
      // let newfilename =req.file.filename+"."+fileType
      // console.log(newfilename )
      // fs.rename('./public/'+req.file.filename,'./public/'+newfilename,()=>{console.log("ok")})
      console.log("ok")
      const id = req.params.id;
      console.log(id+"hh")
     
  
      // if(!req.body.usename){res.send("username vide")}
      const user=
      { username: req.body.username,
        prenom:  req.body.prenom,
        email:req.body.email,
        password: bcrypt.hashSync(req.body.password, 8), 
        contact:req.body.contact,
        date:req.body.date, 
        grade: req.body.grade,
        specialite: req.body.specialite,
        image:req.file.filename,
        // niveauId:niv,
        etablissementenseignementId:req.body.ecole,
    }
  
    console.log(req.file.filename+"co")
    console.log(id+"ccccco")
    
    
    
      User.update(user,  {where: { id: id }})
        .then(num => {
          // res.send(user.username)      
          console.log("ok")
          if (num == 1) {
            console.log("ok")
            var token = jwt.sign({ id: user.id }, "bezkoder-secret-key", {
              expiresIn: 86400 // 24 hours
            });
            // console.log(token+"hhhh")
            
            // console.log(num+ "role")  
            res.status(200).send({
              id: id,
              username: user.username,
              niveauId: user.niveauId,
              contact:user.contact,
              email: user.email,
              image:user.image ,
              roles:user.roles,
              accessToken: token,
              specialite:user.specialite,
              grade:user.grade,
              etablissementenseignementId:user.etablissementenseignementId,
              
              
            });
            console.log(res+"eeee")
         } else {
            // res.send({
            //   message: `Cannot update user with id=${id}. Maybe Tutorial was not found or req.body is empty!${user.username}`
            // });
          }
        })
        .catch(err => {
          // res.send(user)
          res.status(500).send({
            
            message: "Error updating user with id=" + id
          });
        }); 
      
    
    
    }


  //update user
exports.upload= (req,res)=>{
  // await uploadFile(req, res);
    // let fileType=req.file.mimetype.split("/")[1];
    // let newfilename =req.file.filename+"."+fileType
    // console.log(newfilename )
    // fs.rename('./public/'+req.file.filename,'./public/'+newfilename,()=>{console.log("ok")})
    console.log("ok")
    const id = req.params.id;
    console.log(id+"hh")
   

    // if(!req.body.usename){res.send("username vide")}
    const user=
    { username: req.body.username,
      prenom:  req.body.prenom,
      email:req.body.email,
      password: bcrypt.hashSync(req.body.password, 8), 
      contact:req.body.contact,
      date:req.body.date, 
      grade: req.body.grade,
      specialite: req.body.specialite,
      image:req.file.filename,
      niveauId:req.body.niveauId,
      etablissementenseignementId:req.body.ecole,
  }

  console.log(req.file.filename+"co")
  console.log(id+"ccccco")
  
  
  
    User.update(user,  {where: { id: id }})
      .then(num => {
        // res.send(user.username)      
        console.log("ok")
        if (num == 1) {
          console.log("ok")
          var token = jwt.sign({ id: user.id }, "bezkoder-secret-key", {
            expiresIn: 86400 // 24 hours
          });
          // console.log(token+"hhhh")
          
          // console.log(num+ "role")  
          res.status(200).send({
            id: id,
            username: user.username,
            niveauId: user.niveauId,
            contact:user.contact,
            email: user.email,
            image:user.image ,
            roles:user.roles,
            accessToken: token,
            specialite:user.specialite,
            grade:user.grade,
            etablissementenseignementId:user.etablissementenseignementId,
            
            
          });
          console.log(res+"eeee")
       } else {
          // res.send({
          //   message: `Cannot update user with id=${id}. Maybe Tutorial was not found or req.body is empty!${user.username}`
          // });
        }
      })
      .catch(err => {
        // res.send(user)
        res.status(500).send({
          
          message: "Error updating user with id=" + id
        });
      }); 
    
  
  
  }
  exports.getUser=(req, res) => {
    const id = req.params.id;

 User.findByPk(id)
    .then(data => {
      if (data) {
        console.log(data+"rr")
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find user with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving user with id=" + id
      });
    });
  }
  exports.create = (req, res) => {
    // Validate request
    if (!req.body.nomMatiere) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
      // Create a Tutorial
  const matiere = {
    nomMatiere: req.body.nomMatiere,
    description: req.body.description,
    niveauId: req.body.niveauId,
    etablissementenseignementId:req.params.etablissementenseignementId
  };

  // Save Tutorial in the database
  Matiere.create(matiere)
    .then(data => {
      res.send({message:`${data.nomMatiere} ajouté avec succès`});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Matiere."
      });
    });
};
// Retrieve all Tutorials from the database.
exports.findbynomMatiere = (req, res) => {
  const nomMatiere = req.query.nomMatiere;
  var condition = nomMatiere ? { nomMatiere: { [Op.like]: `%${nomMatiere}%` } } : null;

  Matiere.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};
exports.findAll=(req,res)=>{
Matiere.findAll({where:{etablissementenseignementId:req.params.etablissementenseignementId}}).then((data)=>{
  if(data){
  res.send(data);}
else{
  res.send("erreur");
}})
 
}

// find by id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Matiere.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Matiere with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Matiere with id=" + id
      });
    });
};
//update matiere
exports.update = (req, res) => {
  const id = req.params.id;

  Matiere.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Matiere was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Matiere with id=${id}. Maybe Tutorial was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

// Delete a matiere with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Matiere.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Matière a été supprimée avec succès!"
        });
      } else {
        res.send({
          message: `Cannot delete Matiere with id=${id}. Maybe Matiere was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Matiere with id=" + id
      });
    });
};
// get  MatierebyIdFormation
exports.MatierebyIdFormation = (req, res) => {
  // const niveauId = req.query.niveauId;
// console.log(req.params.niveauId)
console.log(req.params.formationId)
var arr =[]
  Formation.findAll({where:{id:req.params.formationId}}  ).then((data)=>{
   
    if(data){
 
data.forEach((value)=>{ arr.push(value.matiereId);

})  
Matiere.findAll({where:{id:arr[0]}}).then(resp=>res.send(resp[0]))
  
  }
  else{
    res.send("erreur");
  }})

  // res.status(200).send("User Content.");
};
// Create and Save new formation
exports.createFormation = (req, res) => {
  const id = req.params.matiereId;
  console.log(req.body.codeEnligne+"ttt")
  // Validate request
  if (!req.body.titre) {
    res.status(400).send({
      message: "titre  vide!"
    });
    
  }
  const formation={
   titre: req.body.titre,
   description:req.body.description,
   type:req.body.type,
   matiereId:id,
   lien:req.body.codeEnligne,
   date:req.body.date,
   isEnligne:req.body.isChecked
  }
   Formation.create(formation)
    .then((formation) => {
      res.status(200).send("chapitre cree")
      console.log(">> Created formation: " + formation);
    
    })
    .catch((err) => {
      console.log(">> Error while creating formation: ", err);
    });
};


exports.getusersformation = (req, res) => {

    User.findAll({where:{isEnligne:"1"},include:{model:Matiere ,as: "matiere",where:{etablissementenseignementId:etablissementenseignementId}}}).then((data)=>{
      console.log("hhh")
      if(data){
        console.log(data+"hhh")
      res.send(data);}
    else{
      res.send("erreur");
    }})
    // res.status(200).send("User Content.");
  };
  //find all chapp superAdmin
  exports.getallchapitreEnligneSuperAd = (req, res) => {

      Formation.findAll({where:{isEnligne:"1"},include:{model:Matiere ,as: "matiere"}}).then((data)=>{
        // console.log("hhh")
        if(data){
          // console.log(data+"hhh")
        res.send(data);}
      else{
        res.send("erreur");
      }})
      // res.status(200).send("User Content.");
    };
  //find chapitre to admin
exports.getallchapitreEnligne = (req, res) => {

const etablissementenseignementId=req.params.etablissementenseignementId
console.log(etablissementenseignementId+"chh")
  Formation.findAll({where:{isEnligne:"1"},include:{model:Matiere ,as: "matiere",where:{etablissementenseignementId:etablissementenseignementId}}}).then((data)=>{
    console.log("hhh")
    if(data){
      console.log(data+"hhh")
    res.send(data);}
  else{
    res.send("erreur");
  }})
  // res.status(200).send("User Content.");
};

// superadmin
exports.getallchapitresuperAd = (req, res) => {
  // const niveauId = req.query.niveauId;
// console.log(req.params.niveauId)

  Formation.findAll({where:{isEnligne:"0"},include:{model:Matiere ,as: "matiere"}}).then((data)=>{
   
    if(data){
     
    res.send(data);}
  else{
    res.send("erreur");
  }})
  // res.status(200).send("User Content.");
};
//admin
exports.getallchapitre = (req, res) => {
  // const niveauId = req.query.niveauId;
// console.log(req.params.niveauId)
const etablissementenseignementId=req.params.etablissementenseignementId
console.log(etablissementenseignementId+"chh")
  Formation.findAll({where:{isEnligne:"0"},include:{model:Matiere ,as: "matiere",where:{etablissementenseignementId:etablissementenseignementId}}}).then((data)=>{
    console.log("ghhh")
    if(data){
      console.log(data+"ghhh")
    res.send(data);}
  else{
    res.send("erreur");
  }})
  // res.status(200).send("User Content.");
};

exports.getformationbyId = (req, res) => {
  // const niveauId = req.query.niveauId;
// console.log(req.params.niveauId)

  Formation.findAll({where:{id:req.params.id}}  ).then((data)=>{
    console.log("ghhh")
    if(data){
    res.send(data);}
  else{
    res.send("erreur");
  }})
  // res.status(200).send("User Content.");
};
exports.FormationFindAll = (req, res) => {
  // const niveauId = req.query.niveauId;
// console.log(req.params.niveauId)
console.log(req.params.matiereId)
  Formation.findAll({where:{matiereId:req.params.matiereId} , order: [[ 'createdAt','DESC']]} ).then((data)=>{
    console.log("ghhh")
    if(data){
    res.send(data);}
  else{
    res.send("erreur");
  }})
  // res.status(200).send("User Content.");
};
// Retrieve all Tutorials from the database.
exports.findbytitre = (req, res) => {
  const titre = req.query.titre;
  const etablissementenseignementId=req.query.etablissementenseignementId
  console.log(titre+"titre")
  var condition = titre ? { titre: { [Op.like]: `%${titre}%` } } : null;
  const isEnligne="0";
  var arr=[]
  Formation.findAll({ where: condition ,include:{model:Matiere,as:"matiere",where:{etablissementenseignementId:etablissementenseignementId}}})
    .then(data => {
      if(data){
        console.log(data)
      data.forEach((value)=>{
        if (value.isEnligne==isEnligne)
       {arr.push(value)
      console.log(arr)
      } 
      })
      res.send(arr)
      }
    else{res.send({message:"no data"})}
      
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};
//upload File
exports.uploadFile= async(req,res)=>{
  if(!req.file){
    console.log(req.body.titre)
  }
  else{console.log("file")
  try{
    console.log(req.file.originalname+"path")
    
    const GOOGLE_API_FOLDER_ID = '1cOP2qPGO1nLS7TpxY5yyaGi4woZLxXIb'
      // console.log(req.file.path+"hhhh")
      const auth = new GoogleAuth({
        keyFile: './controllers/googlekey.json',
        scopes: ['https://www.googleapis.com/auth/drive']
    })

      const driveService = google.drive({
          version: 'v3',
          auth
      })

    const fileMetaData = {
        'name': req.file.originalname,
        'parents': [GOOGLE_API_FOLDER_ID]
    }

    const media = {
        mimeType:req.file.mimetype,
        body: fs.createReadStream(req.file.path)
    }
    // console.log(req.file.mimetype)

    const  response  = await driveService.files.create({
        resource: fileMetaData,
        media: media,
        fields: 'id,name',
    });
    
    const titre=req.body.titre;
    const description=req.body.description;
    const file_name=req.file.originalname;
    const file_path=req.file.path;
    const file_id=response.data.id
    const formationId=req.params.formationId;
    console.log(titre,description)

    const contenu={titre,description,file_path,file_name,file_id,formationId}
    ContenuFormation.create(contenu)
    .then(data => {
      res.send("Nouveau contenu ajouté avec succès");
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Matiere."
      });
    });
    
    console.log(response.data.id+"data")
    const deleteFile = (filePath) => {
      fs.unlink(filePath, () => {
        console.log("file deleted");
      });
    };
    // deleteFile(req.file.path);

// return response.data.id

}
catch(err){
console.log('Upload file error', err)
}




//   console.log(`C:\\Users\\Lenovo\\Desktop\\Reactjs_udemy\\back\\controllers\\upload-files-355309-2f8198337a11.json`)
// const key='./upload-files-355309-2f8198337a11.json'
// const scope = ['https://www.googleapis.com/auth/drive']
  //auth
//   const auth = new GoogleAuth({
//     keyFile: './googlekey.json',
//     scopes: ['https://www.googleapis.com/auth/drive']
// })

// const driveService = google.drive({
//     version: 'v3',
//     auth
// })
//   console.log(auth+"hhhh")

//   const fileMetadata = {
//     name:"file-"+req.file.originalname,
//   parents: ["1EjwyR9nhxBhk7Lx9dp3AREXpvcJEyRIf"], // Change it according to your desired parent folder id
// };

// const media = {
//   mimeType: req.file.mimetype,
//   body: fs.createReadStream(req.file.path),
// };


// const response =  driveService.files.create({
//   requestBody: fileMetadata,
//   media: media,
//   fields: "id",
// });
// return response;




// const uploadFiles = GoogleDriveFileUploader.uploadToGoogleDrive (req.fles)
// res.status(200).send({
//   response:uploadFiles,
// });
  }

}
// list des fichiers
exports.list= async (req,resp)=>{
  
  const auth = new GoogleAuth({
    keyFile: './controllers/googlekey.json',
    scopes: ['https://www.googleapis.com/auth/drive']
})
  const drive = google.drive({ version: "v3", auth });
  console.log(req.params.formationId+"form")
//  let filelist=[];
//  var arr1 =[];
 var i=0;
 const files = [];
 
 await ContenuFormation.findAll({where:{formationId:req.params.formationId}}  ).then(
   async (data)=>{
    if(data){
      var arr1 =[];
      var dataarr1 =[];
      var datatitre =[];
      var datadescription =[];

      data.forEach((value)=>{
        dataarr1.push({file_id:value.file_id,titre:value.titre,description:value.description,file_path:value.file_path})
        console.log(dataarr1)
      })
      
         
  //  const file=  await get (value.file_id);
  //  console.log(file.status)
  const drive = google.drive({ version: "v3", auth });
const l={fileId:""}
  const res = await drive.files.list(data.forEach( (value)=>
    {   l.fileId=value.file_id}
));
console.log(l.fileId+"oooo")
  Array.prototype.push.apply(files, res.files);
  res.data.files.filter( function(file) {
    dataarr1.map(value=>{ 
       if (value.file_id==file.id) {
         file.titre=value.titre
       file.description=value.description
       file.path=value.file_path
       console.log(file.path)
      arr1.push(file)
     console.log('Found file:', file.name, file.id);}
  })
  
  });  

  
      //  console.log(global.arr1 )
      resp.send(arr1)
     
        
  }
  else{
    console.log("erreur");
  }})
  
  const get = (fieldId)=>drive.files.get({
        
    fileId: fieldId,
   
  }, {responseType: 'stream'} ,function(err, res){
    console.log(res.data)})
  
 
    
      
}
//download
exports.download= async (req,resp)=>{
  
  const id =req.params.id;
  const name=req.params.name;
  console.log(id,name)
  const auth = new GoogleAuth({
    keyFile: './controllers/googlekey.json',
    scopes:['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.metadata.readonly']
})
  const drive = google.drive({ version: "v3", auth });

  // files.map((file) => {
    // console.log(file);
    // console.log(`${file.name} (${file.id})`);
    // if (file.name=="file-1656940975703.jpg"){
      // DownloadFile(file.id,auth)
  
      await drive.files.get({fileId: id,alt:'media'}, {responseType: 'stream'},
       async (err, res)=>{
          await  res.data
           .on('end', () => {
              console.log('Done');
           })
           .on('error', err => {
              console.log('Error', err);
           })
           .pipe( fs.createWriteStream(`./public/${name}`));
        })
        setTimeout(()=>resp.download(`./public/${name}`),1000)
        

        // const deleteFile = (filePath) => {
        //   fs.unlink(filePath, () => {
        //     console.log("file deleted");
        //   });
        // };
        // deleteFile(`./public/${name}`);
    // }
  // });
}
exports.DeleteFile = async(req, res) => {
  const id = req.params.id;
const path=req.query.path;
console.log(path,id+"ggggg")
 const deleteFile = (filePath) => {
          fs.unlink(filePath, () => {
            console.log("file deleted");
          });
        };
        deleteFile(path);
        
    const GOOGLE_API_FOLDER_ID = '1EjwyR9nhxBhk7Lx9dp3AREXpvcJEyRIf'
    // console.log(req.file.originalname+"hhhh")
    const auth = new GoogleAuth({
      keyFile: './controllers/googlekey.json',
      scopes: ['https://www.googleapis.com/auth/drive']
  })

    const driveService = google.drive({
        version: 'v3',
        auth
    })


    const  response  = await driveService.files.delete({
     
      'fileId': id
  })
  console.log(response)
   
  ContenuFormation.destroy({
    where: { file_id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "fichier was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete formation with id=${id}. Maybe formation was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete formation with id=" + id
      });
    });
};






// Delete a formation with the specified id in the request
exports.deleteFormationId = (req, res) => {
  const id = req.params.id;

  Formation.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "formation was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete formation with id=${id}. Maybe formation was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete formation with id=" + id
      });
    });
};

exports.updateFormationId = (req, res) => {
  const id = req.params.id;
console.log(req.body.isChecked+"ff")
const formation={
  titre: req.body.titre,
  description:req.body.description,
  type:req.body.type,
  matiereId:id,
  lien:req.body.codeEnligne,
  date:req.body.date,
  isEnligne:req.body.isChecked
 }
  Formation.update(formation, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "La formation a été mise à jour avec succès."
        });
      } else {
        res.send({
          message: `Cannot update Formation with id=${id}. Maybe Formation was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Formation with id=" + id
      });
    });
};
exports.createPayment =async (req, res) =>{
  const {email, payment_method} = req.body;
console.log(email,payment_method)
  const customer = await stripe.customers.create({
    payment_method: payment_method,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method,
    },
   
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    
    items: [{ price: 'price_1LVZ8gEQyRIbZLR8IMlV0480'  }],
    expand: ['latest_invoice.payment_intent']
  });
  const dateExpiration=new Date(subscription.current_period_end* 1000).toISOString().replace("T", " ").replace(".000Z",'')
  
  const status = subscription['latest_invoice']['payment_intent']['status'] 
  const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']
console.log(client_secret)
  res.json({'client_secret': client_secret, 'status': status,'dateExpiration':dateExpiration});
}
exports.updateAbonnementUser=(req,res)=>{
  const id = req.query.id;
  const dateExpiration = req.query.dateExpiration;
  // console.log("id"+id,"status:"+status)
  

  User.update({dateExpiration:dateExpiration}, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "eleve est abonner."
        });
      } else {
        res.send({
          message: `Cannot update eleve with id=${id}. Maybe eleve was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating eleve with id=" + id
      });
    });

}
exports.getProf = (req, res) => {
  // const niveauId = req.query.niveauId;
// console.log(req.params.niveauId)
  User.findAll({include:{model:Role,where:{name:"professeur"}}} ).then((data)=>{
    if(data){
    res.send(data);}
  else{
    res.send("erreur");
  }})
  // res.status(200).send("User Content.");
};
var arr=[]
exports.multipleUpload = async (req, res) => {
  try {
    
    
    await upload(req,res);
    // console.log(req.files);
   const data= req.files
   
   
    // console.log(data[0].filename)
    arr.push(data[0].filename)
       // console.log(req.files['file'].filename+"ch");
    // console.log(req.files['file'].filename+"ch");

    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file.`);
    }
    // data.forEch((value)=>console.log(value.filename))
    const files={file1:"", file2:""}
    var i=0;
    
//     console.log(arr)
// })
// console.log(arr)
  // else{
  //   console.log(i+"hhh")
  // files.file2=value.filename
  // console.log(value)}
// })
// console.log(arr[0],arr[1])
// console.log(req.body.id)
// console.log(req.body.DemandeContrat)
if(arr[1]!=""){
User.update({file1:arr[0],file2:arr[1],demande_contrat:req.body.DemandeContrat}, {
  where: { id: req.body.id }
})
  .then(num => {
    if (num == 1) {
      res.send({
        message: "La demande de contrat est envoyée"
      });
      console.log("eeeettt")
      arr=[]
    } else {
      res.send({
        message: `Échec de l'envoi du demande de contrat`
      });
    }
  })

}
// console.log(arr)
    // return res.send(`Files has been uploaded.`);
  } catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send("Too many files to upload.");
    }
    return res.send(`Error when trying upload many files: ${error}`);
  }
 
};
//prof non accepter
exports.findAllUser=(req,res)=>{
  User.findAll({where:{demande_contrat:"1",contrat:"0",etablissementenseignementId:req.params.etablissementenseignementId}, order: [
    
    ['createdAt', 'DESC']
]}  ).then((data)=>{
    if(data){
    res.send(data);
  console.log(data)}
  else{
    res.send("erreur");
  }})
}
// all users
exports.Allusers=(req,res)=>{
  var arr=[]
  User.findAll( {where:{etablissementenseignementId:req.params.etablissementenseignementId},include:{model:Role,where:{name:"user"}},include:{model:Role}}).then((data)=>{
    if(data){
      data.forEach((val)=>{
      if(val.roles[0].name!="admin")
       {
arr.push(val)
       }})
    res.send(arr);
  console.log(data)}
  else{
    res.send("erreur");
  }})
}
//delete usere
exports.DeleteUser = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: " supprimé avec succès!"
        });
      } else {
        res.send({
          message: `Cannot delete Matiere with id=${id}. Maybe Matiere was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Matiere with id=" + id
      });
    });
};

exports.UpdateUserAccept = (req, res) => {
  const id = req.params.id;
  console.log(id+"id")
const contrat="1"
const demande_contrat="0"
  User.update({contrat:contrat,demande_contrat:demande_contrat}, {
    where: { id: id }
  })

    .then(num => {
      if (num == 1) {
        res.send({
          message: "l'utilisateur a été mis à jour avec succès."
        });
      } else {
        res.send({
          message: `Impossible de mettre à jour l'utilisateur avec id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour de l'utilisateur avec id=" + id
      });
    });
};

exports.sendEmail = (req, res) => {
  
console.log(req.body.Objet,req.body.Message)
  const objet=req.body.Objet;
  const message=req.body.Message;

  //envoie
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hanoslighrt@gmail.com',
      pass: 'ljhsydxafbvomtll'
    }
});

var mailOptions = {
    from: 'hanoslighrt@gmail.com',// sender address
    to: req.body.Email, // list of receivers
    subject: objet, // Subject line
    text:message,
    html: `
    <div style="padding:10px;border-style: ridge">
    <p>You have a new contact request.</p>
    <h3>Contact Details</h3>
    <ul>
       
        <li>objet: ${objet}</li>
        <li>Message: ${message}</li>
    </ul>
    `
};
 
transporter.sendMail(mailOptions, function(error, info){
    if (error)
    {
      console.log(error);
    } 
    else
    {
      res.send({message: 'Email Sent Successfully'})
    }
 
  });



};
exports.Ncontacter = (req, res) => {
  
  console.log(req.body.Objet,req.body.Message)
    const objet=req.body.Objet;
    const message=req.body.Message;
  
    console.log(message)
    var transporter = nodemailer.createTransport({
      service:'gmail',
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: 'hanoslighrt@gmail.com',// sender address
        pass: 'ljhsydxafbvomtll'// sender address
      }
  });
  
  var mailOptions = {
      from:req.body.Email ,// sender address
      to: 'jlassichaima86@gmail.com', // list of receivers
      subject: objet, // Subject line
      text:message,
      html: `
      <div style="padding:10px;border-style: ridge">
      <p>You have a new contact request.</p>
      <h3>Contact Details</h3>
      <ul>
          <li>objet: ${req.body.Email}</li>
          <li>objet: ${objet}</li>
          <li>Message: ${message}</li>
      </ul>
      `
  };
   
  transporter.sendMail(mailOptions, function(error, info){
      if (error)
      {
        console.log(error);
      } 
      else
      {
        res.send({message: 'Email Sent Successfully'})
      }
   
    });
  
  
  
  };


// const params={
//     pageSize: 10,
//     fields: '1EjwyR9nhxBhk7Lx9dp3AREXpvcJEyRIf',
//   }

// const drive = google.drive({ version: "v3", auth });
// const resp =  drive.files.list(params);
// res.send(resp.data.files)
// drive.files.list({
//   pageSize: 10,
//   fields: '1EjwyR9nhxBhk7Lx9dp3AREXpvcJEyRIf',
// }, (err, res) => {
//   if (err) return console.log('The API returned an error: ' + err);
//   const files = res.data.files;
//   if (files.length) {
//     console.log('Files:');
//     files.map((file) => {
//       console.log(`${file.name} (${file.id})`);
//     });
//   } else {
//     console.log('No files found.');
//   }
// });

//   drive.files.list({
//     auth: auth,
//     folderId: '1EjwyR9nhxBhk7Lx9dp3AREXpvcJEyRIf'
//   }, function(error, response) {
//     if (error) { return console.log("ERROR", error); }
//     console.log(response)
//   if(response.items){
//     response.items.forEach(function(item) {
//       var file = fs.createWriteStream("./" + item.title);
//       file.on("finish", function() {
//         console.log("downloaded", item.title);
//       });
  
//       // Download file
//       drive.files.get({
//         auth: auth,
//         fileId: item.id,
//         alt: "media"
//       }).pipe(file);
//     });
// }});
