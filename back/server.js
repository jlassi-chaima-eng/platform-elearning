const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
// app.use("static",express.static("public"))
// const cors = require('cors');
var corsOptions = {

  Origin: "http://localhost:3000",
};





const server = http.createServer(app);
const io = new Server(server, {
  cors: {

    Origin: "http://localhost:3000",
  },
});
app.use(cors(corsOptions));


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// let interval;
// let onlineUsers = [];
// const io = new Server(server);
// let onlineUsers = [];

// const addNewUser = (email, socketId) => {
//   console.log(email,socketId)
//   !onlineUsers.some((user) => user.email === email) &&
//     onlineUsers.push({ email, socketId });
//     console.log(onlineUsers)
// };
// const getUser = (email) => {
//   console.log(email)

//   return onlineUsers.find((user) => user.email === email);
// };
// const removeUser = (socketId) => {
//   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
// };
var test = true;
io.on("connection", (socket) => {

  console.log(`User Connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log('user disconnected' + socket.id);
  });
  //   // socket.on("newUser", (email) => {

  //   //   console.log(email+"email")
  //   //   console.log(socket.id+"role")

  //   //   addNewUser(email, socket.id);

  //   //   // socket.join(socket.id);

  //   //   });



  socket.on("send_message", (data) => {
    // const receiver = getUser(data.email);
    // onlineUsers.forEach((value) =>  console.log(value.email+"cccc") );
    console.log(data + "iiiiiiiii")
    // console.log(socket.id+"onlineUsers")
    io.emit("receive_message", data);



    // socket.disconnect();
  });

});

app.use("/profile", express.static('./public'))
app.use("/uploadFile", express.static('./public/uploadFile'))
app.use("/imageEcole", express.static('./public/uploadFile'))
// database
const db = require("./models/index.js");
const Role = db.role;
const Niveau = db.niveau;
const Etablissement = db.EtablissementEnseignement;
db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });
// initial();
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// set port, listen for requests



function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
  // console.log("ch")
  Role.create({
    id: 2,
    name: "professeur"
  });

  Role.create({
    id: 3,
    name: "admin"
  });
  Role.create({
    id: 4,
    name: "superAdmin"
  });

}
// initialNiveau();
function initialNiveau() {
  Niveau.create({

    name: "CP"
  });
  // console.log("ch")
  Niveau.create({

    name: "CE1"
  });

  Niveau.create({

    name: "CE2"
  });
}
// initialEtablissement()
function initialEtablissement() {
  Etablissement.create({

    nom: "saladin", adresse: "sousse",image:"",hor:"10.623235234705136",ver:"35.838528441468284"
  });
  // console.log("ch")
  Etablissement.create({

    nom: "maria", adresse: "sousse",image:"",hor:"10.615151894578316",ver:"35.836276849223154"
  });

  Etablissement.create({

    nom: "Grole", adresse: "sousse",image:"",hor:"10.624993748593386",ver:"35.828065094036425"
  });
}