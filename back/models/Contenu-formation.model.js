module.exports = (sequelize, Sequelize) => {
    const ContenuFormation = sequelize.define("contenu-formation", {
       titre: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      file_path: {
        type: Sequelize.STRING
      },
      file_name: {
        type: Sequelize.STRING
      },
      file_id: {
        type: Sequelize.STRING
      }
    });
  
    return ContenuFormation;
  };