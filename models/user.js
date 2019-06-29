'use strict'; // eslint-disable-line
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
  }, {});
  User.associate = function (models) { // eslint-disable-line
    User.hasMany(models.Tweet);
    User.belongsToMany(models.Tweet, {
      through: models.Like,
      foreignKey: 'UserId',
      as: 'LikeTweets',
    });
  };
  return User;
};
