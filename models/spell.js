'use strict';
module.exports = (sequelize, DataTypes) => {
  const spell = sequelize.define('spell', {
    name: DataTypes.STRING,
    url: DataTypes.STRING
  }, {});
  spell.associate = function(models) {
    // associations can be defined here
  };
  return spell;
};