const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
//upload image
var multer =require('multer')
const path = require('path')
var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, './public/')     // './public/images/' directory name where save the file
  },
  filename: (req, file, callBack) => {
      callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({
  storage: storage
}).single('image');

var storageupload = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, './public/uploadFile')    
  },
  filename: (req, file, callBack) => {
      callBack(null, file.originalname)
  }
})
var uploadFile = multer({
  storage: storageupload
}).single("file");

// uplaod multiple file
var storageFileToAdmin =  multer.diskStorage({
  destination: async (req, file, callback) => {
    callback(null, path.join(`./public/uploadFile`));
  },
  filename: async (req, file, callback) => {
    const match = ["image/png", "image/jpeg","application/pdf","video/mp4"];
    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
      return callback(message, null);
    }
    var filename = `${file.originalname}`;
    callback(null, filename);
  }
});
var uploadFiles =  multer({ storage: storageFileToAdmin }).array("file", 3);
// var uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    
    next();
  });

  app.get("/api/test/all/:niveauId/:etablissementenseignementId", controller.allAccess);
  app.get("/api/test/all/getFormationEnLigne/:niveauId/:etablissementenseignementId", controller.getFormationEnLigne);
  
  app.get(
    "/api/test/user/:niveauId/:etablissementenseignementId",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/test/SuperAdmin/getMatieresSAdmin",
    [authJwt.verifyToken],
    controller.getMatieresSAdmin
  );
  app.get(
    "/api/test/prof",
    [authJwt.verifyToken, authJwt.isProf],
    controller.profBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  app.get(
    "/api/test/SuperAdmin",
    [authJwt.verifyToken, authJwt.isSuperAdmin],
    controller.SuperAdminBoard
  );
//admin can accept prof
app.get("/api/test/AllUser/:etablissementenseignementId",[authJwt.verifyToken],   controller.findAllUser);
app.put("/api/test/UpdateUserAccept/:id",   controller.UpdateUserAccept);
//get Niveau
app.get("/api/test/Niveau",   controller.GetNiveau);
app.post("/api/test/Ajouter/Niveau",[authJwt.verifyToken],   controller.AjouterNiveau);
app.delete("/api/test/Delete/Niveau/:id",[authJwt.verifyToken],   controller.DeleteNiveau);
//Ecole
app.get("/api/test/Etablissement",    controller.GetEtablissement);
app.get("/api/test/GET/Etablissement/Profile/:etablissementenseignementId", [authJwt.verifyToken],   controller.GetEtablissementProfil);
app.get("/api/test/Etablissement/byId/:id",   controller.GetEtablissementbyId);
app.post("/api/test/Ajouter/Ecole", upload,  controller.AjouterEcole);
app.put("/api/test/Modifier/Ecole/:id", upload,  controller.ModifierEcole);

app.delete("/api/test/Delete/Ecole/:id",[authJwt.verifyToken],   controller.DeleteEcole);
//  getallchaphome
app.get("/api/test/allchapitre/:etablissementenseignementId", [authJwt.verifyToken], controller.getallchapitre);
app.get("/api/test/getallchapitresuperAd/", [authJwt.verifyToken], controller.getallchapitresuperAd);


app.get("/api/test/getallchapitreEnligne/:etablissementenseignementId", [authJwt.verifyToken], controller.getallchapitreEnligne);
app.get("/api/test/getallchapitreEnligneSuperAd/", [authJwt.verifyToken], controller.getallchapitreEnligneSuperAd);


// get users similar to formation
app.get("/api/test/getusers/formation/matieres/", [authJwt.verifyToken], controller.getusersformation);


//update user
app.put("/api/test/user/update/:id",upload,controller.upload)
app.put("/api/test/user/updateAdminProfil/:id",upload,controller.updateAdminProfil)
//get useer by id
app.get("/api/test/dateExp/abonnement/:id",[authJwt.verifyToken],controller.getUser)
app.get("/api/test/Professeur/",[authJwt.verifyToken],controller.getProf)
//
app.get("/api/test/GET/Users/:etablissementenseignementId",[authJwt.verifyToken],controller.Allusers)
app.delete("/api/test/Delete/Users/:id",[authJwt.verifyToken],controller.DeleteUser)
//deleete file
app.delete("/api/test/Delete/File/:id",controller.DeleteFile)

//upload File API
app.post("/upload-to-google-drive/:formationId", uploadFile,  controller.uploadFile);
app.get("/api/test/list/:formationId", controller.list);
app.get("/api/test/list/:id/:name",   controller.download);
app.delete("/api/test/formation/:id",  [authJwt.verifyToken],controller.deleteFormationId);
app.put("/api/test/formation/update/:id",  controller.updateFormationId);

//upload multipleFile to admin
app.post("/multiple-upload",  controller.multipleUpload);
  // Retrieve all Matieres
app.get("/api/test/formationSearch/",  controller.findbytitre);
  // Retrieve all Matieres
// app.get("/api/test/:nomMatiere",   [authJwt.verifyToken],controller.findbynomMatiere);
  // Retrieve a single Matiere with id
 app.get("/api/test/:id", [authJwt.verifyToken], controller.findOne);

 
 //recherche par niveau les matieres
 app.get("/api/test/niveau/:val/:etablissementenseignementId", [authJwt.verifyToken], controller.findbyNiveau);
  //recherche par ecole les admin
 app.get("/api/test/ecole/:val", [authJwt.verifyToken], controller.findbyEcole);
 app.get("/api/test/Get/Admin/", [authJwt.verifyToken], controller.findbyAdmin);
 app.post("/api/test/Ajouter/Admin/", [authJwt.verifyToken], controller.AjouterAdmin);
 app.post("/api/test/Update/Admin/:id", [authJwt.verifyToken], controller.UpdateAdmin);

 
  // Update a Matiere with id
 app.put("/api/test/Matiere/update/:id",  [authJwt.verifyToken], controller.update);
//create matiere
app.post("/api/test/Matiere/create/:etablissementenseignementId", [authJwt.verifyToken],  controller.create);
app.get("/api/test/GET/Matiere/:etablissementenseignementId",   [authJwt.verifyToken],controller.findAll);
  // Delete a Matiere with id
 app.delete("/api/test/Matiere/:id",  [authJwt.verifyToken],controller.delete);
// get matiere by id formation
app.get("/api/test/Matiere/byIdFormation/:formationId",   [authJwt.verifyToken],controller.MatierebyIdFormation);


  // Delete all Matieres
//  app.delete("/api/test/",  [authJwt.verifyToken], controller.deleteAll);
//formation
app.post("/api/test/matiere/formation/:matiereId",   [authJwt.verifyToken],controller.createFormation);
app.get("/api/test/matiere/formation/:matiereId",   [authJwt.verifyToken],controller.FormationFindAll);
app.get("/api/test/matiere/getformationbyId/:id",   [authJwt.verifyToken],controller.getformationbyId);


//payment
app.post("/api/test/payment",   controller.createPayment);

app.put("/api/test/user/abonnement/updateAbonnementUser/",controller.updateAbonnementUser)
//emailing
app.post("/api/test/sendEmail/",[authJwt.verifyToken],controller.sendEmail)
app.post("/api/test/Ncontacter/",[authJwt.verifyToken],controller.Ncontacter)


};

