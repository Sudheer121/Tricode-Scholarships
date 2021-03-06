'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class scholarship_has_users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      scholarship_has_users.hasOne(models.User, {
        foreignKey: 'id'
      });

      scholarship_has_users.belongsTo(models.scholarship, {
        foreignKey: 'id'
      });
    }
  };
  scholarship_has_users.init({
    status: { 
    type:DataTypes.STRING,
    defaultValue: 'pending'
    },
    acount_number: DataTypes.STRING,
    scholarship_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'scholarship_has_users',
    tableName: 'students_has_scholarship'
  });
  return scholarship_has_users;
};