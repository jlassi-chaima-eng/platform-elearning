module.exports = (sequelize, Sequelize) => {
    const Formation = sequelize.define("formation", {
       titre: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      }
      ,
      type: {
        type: Sequelize.STRING,
        defaultValue:"paye"
      },
      lien: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      isEnligne: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  
    return Formation;
  };