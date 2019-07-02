'use strict';
module.exports = (sequelize, DataTypes) => {
  const grimoire = sequelize.define('grimoire', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    characterId: DataTypes.INTEGER
  }, {});
  grimoire.associate = function(models) {
    // associations can be defined here
    models.grimoire.belongsToMany(models.spell, {through: 'grimoireSpells'});
    models.grimoire.belongsTo(models.character);
  };
  return grimoire;
};