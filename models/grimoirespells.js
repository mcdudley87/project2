'use strict';
module.exports = (sequelize, DataTypes) => {
  const grimoireSpells = sequelize.define('grimoireSpells', {
    spellId: DataTypes.INTEGER,
    grimoireId: DataTypes.INTEGER,
    notes: DataTypes.TEXT
  }, {});
  grimoireSpells.associate = function(models) {
    // associations can be defined here
  };
  return grimoireSpells;
};