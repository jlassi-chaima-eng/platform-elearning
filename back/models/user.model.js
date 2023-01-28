
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
      username: {
        type: Sequelize.STRING
      },
      prenom: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique:true
      },
      password: {
        type: Sequelize.STRING
      },
      contact: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
        
      },
     grade: {
        type: Sequelize.STRING
      },
      specialite: {
        type: Sequelize.STRING
      },
     
      contrat: {
        type: Sequelize.INTEGER,
        defaultValue:"0"
      },
      demande_contrat: {
        type: Sequelize.INTEGER,
        defaultValue:"0"
      },
      image: {
        type: Sequelize.STRING
      },
      dateExpiration: {
        type: Sequelize.DATE
        
      },file1: {
        type: Sequelize.STRING
      },file2: {
        type: Sequelize.STRING
      }
      
    
    });
  
    return User;
  };