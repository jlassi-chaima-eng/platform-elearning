module.exports = (sequelize, Sequelize) => {
    const Niveau = sequelize.define("niveau", {
    
     name: {
        type:  Sequelize.STRING
      }
    });
  
    return Niveau;
  };