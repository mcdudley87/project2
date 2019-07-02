'use strict';
module.exports = (sequelize, DataTypes) => {
  const character = sequelize.define('character', {
    name: DataTypes.STRING,
    class: DataTypes.STRING,
    level: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  character.associate = function(models) {
    // associations can be defined here
    models.character.belongsTo(models.user);
    models.character.hasMany(models.grimoire);
  };
  return character;
};