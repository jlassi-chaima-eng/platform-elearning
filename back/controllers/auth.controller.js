const db = require("../models");
// const config = require("../config/auth.config");
//secret: "bezkoder-secret-key"
const User = db.user;
const Role = db.role;
//login with google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('974348447556-esrimbovonc62r5pkg2lo2ghsck0vcml.apps.googleusercontent.com');
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.googleLogin = async (req, res) => {
console.log(req.body.username)
User.findOne({
  where: {
    email: req.body.email
  }
})
  .then(user => {
    if (user) {
     console.log(user.password+"rrr")
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, "bezkoder-secret-key", {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.send({
          id: user.id,
          username: user.username,
          niveauId: user.niveauId,
          contact: user.contact,
          email: user.email,
          prenom: user.prenom,
          image: user.image,
          grade: user.grade,
          specialite: user.specialite,
          roles: authorities,
          accessToken: token,
          contrat: user.contrat,
          etablissementenseignementId:   user.etablissementenseignementId,
        });

      })
}
    
    
    else{
const niveauId="1"
  User.create({
    username: req.body.username,
    prenom: req.body.prenom,
    email: req.body.email,
    image: req.body.picture,
    password: bcrypt.hashSync(req.body.password, 8),
    niveauId:niveauId
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({
              id: user.id,
              username: user.username,
              niveauId: user.niveauId,
              contact: user.contact,
              email: user.email,
              prenom: user.prenom,
              image: user.image,
              grade: user.grade,
              specialite: user.specialite,
              roles: authorities,
              accessToken: token,
              contrat: user.contrat,
              etablissementenseignementId:   user.etablissementenseignementId,

            });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }

          var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );

          if (!passwordIsValid) {
            return res.status(401).send({
              accessToken: null,
              message: "Invalid Password!"
            });
          }

          var token = jwt.sign({ id: user.id }, "bezkoder-secret-key", {
            expiresIn: 86400 // 24 hours
          });

          var authorities = [];
          user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
              authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            res.send({
              id: user.id,
              username: user.username,
              niveauId: user.niveauId,
              contact: user.contact,
              email: user.email,
              prenom: user.prenom,
              image: user.image,
              grade: user.grade,
              specialite: user.specialite,
              roles: authorities,
              accessToken: token,
              contrat: user.contrat,
              etablissementenseignementId:   user.etablissementenseignementId,
            });

          })
    }
        )
      }})
    .catch (err => {
        res.status(500).send({ message: err.message });
      });
    }})
};




exports.signup = (req, res) => {
  // Save User to Database
  // const Customer = await stripe.customers.create({
  //   name: req.body.username,
  //   email: req.body.email,
  //   phone: req.body.contact,
  // });
  // console.log(Customer+"Customer")
  User.create({
    username: req.body.username,
    prenom: req.body.prenom,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    contact: req.body.contact,
    date: req.body.date,
    grade: req.body.grade,
    specialite: req.body.specialite,
    niveauId: req.body.niveauId,
    roles: req.body.roles,
    etablissementenseignementId: req.body.ecole,
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, "bezkoder-secret-key", {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        console.log(user.contrat)
        res.status(200).send({
          id: user.id,
          username: user.username,
          niveauId: user.niveauId,
          contact: user.contact,
          email: user.email,
          prenom: user.prenom,
          image: user.image,
          grade: user.grade,
          specialite: user.specialite,
          roles: authorities,
          accessToken: token,
          contrat: user.contrat,
          etablissementenseignementId:   user.etablissementenseignementId,

        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};