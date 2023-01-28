module.exports = (sequelize, Sequelize) => {
    const Matiere = sequelize.define("matieres", {
       nomMatiere: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      }
   

    });
  
    return Matiere;
  };