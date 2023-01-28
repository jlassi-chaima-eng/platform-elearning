module.exports = (sequelize, Sequelize) => {
    const EtablissementEnseignement = sequelize.define("etablissementenseignement", {
       nom: {
        type: Sequelize.STRING
      },
      adresse: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      ver: {
        type: Sequelize.STRING
      },
      hor: {
        type: Sequelize.STRING
      }
   

    });
  
    return EtablissementEnseignement;
  };