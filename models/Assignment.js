module.exports = function(sequelize, DataTypes) {
  var Assignments = sequelize.define('Assignments', {
    assignName: {
      type: DataTypes.STRING
    }
  });
  Assignments.associate = function(models) {
    Assignments.hasMany(models.Grades);
  };
  return Assignments;
};
